'use strict'

class AlexaMessageBuilder {
  constructor() {
    this.template = {
      version: '1.0',
      response: {
        shouldEndSession: true
      }
    }
  }

  addVersion(versionString) {
    if (typeof versionString !== 'string')
      throw new Error('You need to provide version as a string for addVersion method, ie. "1.0"')

    this.template.version = versionString

    return this
  }

  addSessionAttribute(key, value) {
    if (typeof key !== 'string' || typeof value === 'undefined')
      throw new Error('You need to provide both key and value for addSessionAttribute method')

    if (!this.template.sessionAttributes)
      this.template.sessionAttributes = {}

    this.template.sessionAttributes[key] = value

    return this
  }

  addOutputSpeech(type, text, isReprompt) {
    if (['PlainText', 'SSML'].indexOf(type) < 0)
      throw new Error('You need to provide type and it can be either "PlainText" or "SSML" for addOutputSpeech method')

    if (typeof text !== 'string')
      throw new Error('You need to provide text as a string for addText, addSSML and addOutputSpeech methods')

    if (typeof this.template.response.outputSpeech === 'object' && !isReprompt)
      throw new Error('You can call addText or addSSML only once')

    let obj = this.template.response
    if (isReprompt) {
      this.template.response.reprompt = {}
      obj = obj.reprompt
    }

    obj.outputSpeech = {
      type: type
    }

    obj.outputSpeech[type === 'SSML' ? 'ssml' : 'text'] = text

    return this
  }

  addText(text) {
    return this.addOutputSpeech('PlainText', text)
  }

  addSSML(ssmlString) {
    return this.addOutputSpeech('SSML', ssmlString)
  }

  addRepromptText(text) {
    return this.addOutputSpeech('PlainText', text, true)
  }

  addRepromptSSML(ssmlString) {
    return this.addOutputSpeech('SSML', ssmlString, true)
  }

  addSimpleCard(title, content) {
    if (typeof title !== 'string' || typeof content !== 'string')
      throw new Error('You need to provide title and content as strings for addSimpleCard method')

    this.template.response.card = {
      type: 'Simple',
      title: title,
      content: content
    }

    return this
  }

  addStandardCard(title, text, imageObject) {
    this.template.response.card = {
      type: 'Standard',
      title: title,
      text: text
    }

    if (typeof imageObject === 'object' && (imageObject.smallImageUrl || imageObject.largeImageUrl))
      this.template.response.card.image = imageObject

    return this
  }

  addDialogDelegate(updatedIntent) {
    if (!this.template.response.directives) {
      this.template.response.directives = []
    }

    const directive = {
      type: 'Dialog.Delegate'
    }

    if (updatedIntent) {
      directive.updatedIntent = updatedIntent
    }

    this.template.response.directives.push(directive)

    return this
  }

  addDialogElicitSlot(slot, updatedIntent) {
    if (!this.template.response.directives) {
      this.template.response.directives = []
    }

    const directive = {
      type: 'Dialog.ElicitSlot',
      slotToElicit: slot
    }

    if (updatedIntent) {
      directive.updatedIntent = updatedIntent
    }

    this.template.response.directives.push(directive)

    return this
  }

  addDialogConfirmSlot(slot, updatedIntent) {
    if (!this.template.response.directives) {
      this.template.response.directives = []
    }

    const directive = {
      type: 'Dialog.ConfirmSlot',
      slotToConfirm: slot
    }

    if (updatedIntent) {
      directive.updatedIntent = updatedIntent
    }

    this.template.response.directives.push(directive)

    return this
  }

  addDialogConfirmIntent(updatedIntent) {
    if (!this.template.response.directives) {
      this.template.response.directives = []
    }

    const directive = {
      type: 'Dialog.ConfirmIntent'
    }
    
    if (updatedIntent) {
      directive.updatedIntent = updatedIntent
    }

    this.template.response.directives.push(directive)

    return this
  }

  keepSession() {
    this.template.response.shouldEndSession = false

    return this
  }


  get() {
    return this.template
  }
}

module.exports = AlexaMessageBuilder
