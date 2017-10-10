/* global describe, it, expect */
'use strict'

const AlexaMessageBuilder = require('../lib')

describe('Alexa Message Builder', () => {
  it('should be a class', () => {
    const message = new AlexaMessageBuilder()
    expect(typeof AlexaMessageBuilder).toBe('function')
    expect(message instanceof AlexaMessageBuilder).toBeTruthy()
  })

  it('should export an object when you invoke get method', () => {
    const message = new AlexaMessageBuilder().get()
    expect(message).toEqual({
      version: '1.0',
      response: {
        shouldEndSession: true
      }
    })
  })

  describe('addVersion', () => {
    it('should be a function', () => {
      const message = new AlexaMessageBuilder()
      expect(typeof message.addVersion).toBe('function')
    })

    it('should throw an error if version is not provided or not string', () => {
      const message = new AlexaMessageBuilder()

      expect(() => message.addVersion()).toThrowError('You need to provide version as a string for addVersion method, ie. "1.0"')
      expect(() => message.addVersion(1)).toThrowError('You need to provide version as a string for addVersion method, ie. "1.0"')
      expect(() => message.addVersion(1.0)).toThrowError('You need to provide version as a string for addVersion method, ie. "1.0"')
      expect(() => message.addVersion({})).toThrowError('You need to provide version as a string for addVersion method, ie. "1.0"')
    })

    it('should set a version if it is provided', () => {
      const message = new AlexaMessageBuilder()

      expect(message.addVersion('2.0') instanceof AlexaMessageBuilder).toBeTruthy()
      expect(message.addVersion('2.0').get()).toEqual({
        version: '2.0',
        response: {
          shouldEndSession: true
        }
      })
    })
  })

  describe('addSessionAttribute', () => {
    it('should be a function', () => {
      const message = new AlexaMessageBuilder()
      expect(typeof message.addSessionAttribute).toBe('function')
    })

    it('should throw an error if key is not string or value is not provided', () => {
      const message = new AlexaMessageBuilder()
      expect(() => message.addSessionAttribute()).toThrowError('You need to provide both key and value for addSessionAttribute method')
      expect(() => message.addSessionAttribute(1)).toThrowError('You need to provide both key and value for addSessionAttribute method')
      expect(() => message.addSessionAttribute('key')).toThrowError('You need to provide both key and value for addSessionAttribute method')
    })

    it('should add a session attribute', () => {
      const message = new AlexaMessageBuilder().addSessionAttribute('key', 'value')
      expect(message instanceof AlexaMessageBuilder).toBeTruthy()
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true
        },
        sessionAttributes: {
          key: 'value'
        }
      })
    })

    it('should add multiple session attributes', () => {
      const message = new AlexaMessageBuilder()
        .addSessionAttribute('key1', 'value1')
        .addSessionAttribute('key2', 'value2')

      expect(message instanceof AlexaMessageBuilder).toBeTruthy()
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true
        },
        sessionAttributes: {
          key1: 'value1',
          key2: 'value2'
        }
      })
    })

    it('should keep only the session attribute if they have the same key', () => {
      const message = new AlexaMessageBuilder()
        .addSessionAttribute('key', 'value1')
        .addSessionAttribute('key', 'value2')

      expect(message instanceof AlexaMessageBuilder).toBeTruthy()
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true
        },
        sessionAttributes: {
          key: 'value2'
        }
      })
    })
  })

  describe('addOutputSpeech', () => {
    it('should be a function', () => {
      const message = new AlexaMessageBuilder()
      expect(typeof message.addOutputSpeech).toBe('function')
    })

    it('should throw an error if type is not PlainText, or SSML or value is not provided', () => {
      const message = new AlexaMessageBuilder()
      expect(() => message.addOutputSpeech()).toThrowError('You need to provide type and it can be either "PlainText" or "SSML" for addOutputSpeech method')
      expect(() => message.addOutputSpeech('test')).toThrowError('You need to provide type and it can be either "PlainText" or "SSML" for addOutputSpeech method')
      expect(() => message.addOutputSpeech(5)).toThrowError('You need to provide type and it can be either "PlainText" or "SSML" for addOutputSpeech method')
    })

    it('should throw an error if text is not stringr or value is not provided', () => {
      const message = new AlexaMessageBuilder()
      expect(() => message.addOutputSpeech('SSML')).toThrowError('You need to provide text as a string for addText, addSSML and addOutputSpeech methods')
      expect(() => message.addOutputSpeech('SSML', 5)).toThrowError('You need to provide text as a string for addText, addSSML and addOutputSpeech methods')
    })

    it('should throw an error if you call addText or addSSML more then once', () => {
      const message = new AlexaMessageBuilder()
      expect(() => message.addOutputSpeech('SSML', 'text').addOutputSpeech('SSML', 'text')).toThrowError('You can call addText or addSSML only once')
    })

    it('with reprompt', () => {
      const message = new AlexaMessageBuilder().addOutputSpeech('SSML', 'some text', true)
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true,
          reprompt: {
            outputSpeech : {
              type: 'SSML',
              ssml: 'some text'
            }
          }
        }
      })
    })

    it('without reprompt', () => {
      const message = new AlexaMessageBuilder().addOutputSpeech('SSML', 'some text', false)
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true,
          outputSpeech : {
            type: 'SSML',
            ssml: 'some text'
          }
        }
      })
    })

    it('before reprompt', () => {
      const message = new AlexaMessageBuilder().addOutputSpeech('SSML', 'some text', false).addRepromptSSML('some reprompt text')
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true,
          outputSpeech : {
            type: 'SSML',
            ssml: 'some text'
          },
          reprompt: {
            outputSpeech : {
              type: 'SSML',
              ssml: 'some reprompt text'
            }
          }
        }
      })
    })

  })

  describe('addSimpleCard', () => {
    it('should be a function', () => {
      const message = new AlexaMessageBuilder()
      expect(typeof message.addSimpleCard).toBe('function')
    })

    it('should return error if title or content are not provided or if they are not a string', () => {
      const message = new AlexaMessageBuilder()
      expect(() => message.addSimpleCard()).toThrowError('You need to provide title and content as strings for addSimpleCard method')
      expect(() => message.addSimpleCard(5)).toThrowError('You need to provide title and content as strings for addSimpleCard method')
      expect(() => message.addSimpleCard(5, [])).toThrowError('You need to provide title and content as strings for addSimpleCard method')
      expect(() => message.addSimpleCard({}, 6)).toThrowError('You need to provide title and content as strings for addSimpleCard method')
    })

    it('should add simple card', () => {
      const message = new AlexaMessageBuilder().addSimpleCard('some title', 'some content')
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true,
          card: {
            type: 'Simple',
            title: 'some title',
            content: 'some content'
          }
        }
      })
    })
  })

  describe('addStandardCard', () => {
    it('should be a function', () => {
      const message = new AlexaMessageBuilder()
      expect(typeof message.addStandardCard).toBe('function')
    })

    it('should add standard card', () => {
      const message = new AlexaMessageBuilder().addStandardCard('some title', 'some text', { smallImageUrl: 'http://example.com/small-image-url.png', largeImageUrl: 'http://example.com/large-image-url.png' })
      expect(message.get()).toEqual({
        version: '1.0',
        response: {
          shouldEndSession: true,
          card: {
            type: 'Standard',
            title: 'some title',
            text: 'some text',
            image: {smallImageUrl: 'http://example.com/small-image-url.png', largeImageUrl: 'http://example.com/large-image-url.png'}
          }
        }
      })
    })
  })

  describe('dialog directives', () => {
    const intent = {
      name: 'TestIntent',
      confirmationStatus: 'None',
      slots: { }
    }

    describe('addDialogDelegate', () => {
      it('should be a function', () => {
        const message = new AlexaMessageBuilder()
        expect(typeof message.addDialogDelegate).toBe('function')
      })

      it('should add a delegate directive', () => {
        const message = new AlexaMessageBuilder().addDialogDelegate(intent)
        expect(message.get()).toEqual({
          version: '1.0',
          response: {
            shouldEndSession: true,
            directives: [
              {
                type: 'Dialog.Delegate',
                updatedIntent: intent
              }
            ]
          }
        })
      })
    })

    describe('addDialogElicitSlot', () => {
      it('should be a function', () => {
        const message = new AlexaMessageBuilder()
        expect(typeof message.addDialogElicitSlot).toBe('function')
      })

      it('should add a elicit slot directive', () => {
        const message = new AlexaMessageBuilder().addDialogElicitSlot('slotname', intent)
        expect(message.get()).toEqual({
          version: '1.0',
          response: {
            shouldEndSession: true,
            directives: [
              {
                type: 'Dialog.ElicitSlot',
                slotToElicit: 'slotname',
                updatedIntent: intent
              }
            ]
          }
        })
      })
    })

    describe('addDialogConfirmSlot', () => {
      it('should be a function', () => {
        const message = new AlexaMessageBuilder()
        expect(typeof message.addDialogConfirmSlot).toBe('function')
      })

      it('should add a confirm slot directive', () => {
        const message = new AlexaMessageBuilder().addDialogConfirmSlot('slotname', intent)
        expect(message.get()).toEqual({
          version: '1.0',
          response: {
            shouldEndSession: true,
            directives: [
              {
                type: 'Dialog.ConfirmSlot',
                slotToConfirm: 'slotname',
                updatedIntent: intent
              }
            ]
          }
        })
      })
    })

    describe('addDialogConfirmIntent', () => {
      it('should be a function', () => {
        const message = new AlexaMessageBuilder()
        expect(typeof message.addDialogConfirmIntent).toBe('function')
      })

      it('should add a delegate directive', () => {
        const message = new AlexaMessageBuilder().addDialogConfirmIntent(intent)
        expect(message.get()).toEqual({
          version: '1.0',
          response: {
            shouldEndSession: true,
            directives: [
              {
                type: 'Dialog.ConfirmIntent',
                updatedIntent: intent
              }
            ]
          }
        })
      })
    })
  })
})
