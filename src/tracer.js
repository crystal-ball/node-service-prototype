'use strict'

require('dotenv').config()

const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { CollectorTraceExporter } = require('@opentelemetry/exporter-collector')
const {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} = require('@opentelemetry/tracing')

// eslint-disable-next-line node/no-process-env
const { LS_ACCESS_TOKEN } = process.env

// Create and register the tracer provider
const provider = new NodeTracerProvider()
provider.register()

// Create the span processor - export to LS if an access token is provided, otherwise
// console.log span information
let spanProcessor
if (LS_ACCESS_TOKEN) {
  const exporter = new CollectorTraceExporter({
    serviceName: 'node-service-prototype',
    url: 'https://ingest.lightstep.com/traces/otlp/v0.6',
    headers: {
      'Lightstep-Access-Token': LS_ACCESS_TOKEN,
    },
  })

  spanProcessor = new BatchSpanProcessor(exporter)
} else {
  spanProcessor = new SimpleSpanProcessor(new ConsoleSpanExporter())
}

provider.addSpanProcessor(spanProcessor)

// Register and load instrumentation
registerInstrumentations({
  instrumentations: [
    // Express instrumentation expects HTTP layer to be instrumented
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
  ],
  tracerProvider: provider,
})
