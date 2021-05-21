import { config } from 'dotenv'

import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { NodeTracerProvider } from '@opentelemetry/node'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express'
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector'
import { Resource, SERVICE_RESOURCE } from '@opentelemetry/resources'
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/tracing'

config()

// eslint-disable-next-line node/no-process-env
const { GIT_SHA, LS_ACCESS_TOKEN } = process.env

// Create and register the tracer provider
const provider = new NodeTracerProvider({
  resource: new Resource({
    [SERVICE_RESOURCE.VERSION]: (GIT_SHA || 'local').slice(0, 7),
  }),
})
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
