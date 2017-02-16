/* global describe, it, expect */
'use strict'

const AlexaMessageBuilder = require('../lib')

describe('Alexa Message Builder', () => {
  it('should be a class', () => {
    const message = new AlexaMessageBuilder()
    expect(typeof AlexaMessageBuilder).toBe('function')
    expect(message instanceof AlexaMessageBuilder).toBeTruthy()
  })
})
