# Alexa Message Builder

[![](https://travis-ci.org/stojanovic/alexa-message-builder.svg?branch=master)](https://travis-ci.org/stojanovic/alexa-message-builder)
[![npm](https://img.shields.io/npm/v/alexa-message-builder.svg?maxAge=2592000?style=plastic)](https://www.npmjs.com/package/alexa-message-builder)
[![npm](https://img.shields.io/npm/l/alexa-message-builder.svg?maxAge=2592000?style=plastic)](https://github.com/claudiajs/alexa-message-builder/blob/master/LICENSE)

Simple message builder for Alexa response.

## Installation

Alexa Message Builder is available as a node module on NPM.

Install it by running:

```shell
npm install alexa-message-builder --save
```

## Usage

After installing the package, require it in your code:

```javascript
const AlexaMessageBuilder = require('alexa-message-builder')
```

or with `import`* syntax:

```javascript
import AlexaMessageBuilder from 'alexa-message-builder'
```

\* `import` syntax is not supported in Node.js, you need to use additional library like Babel to make it work.

After requiring it, you simply need to initialize the class, use any of available methods from the [documentation](#documentation) below and call `.get()` in the end. For Example:

```javascript
const AlexaMessageBuilder = require('alexa-message-builder')

const message = new AlexaMessageBuilder()
  .addText('Hello from Alexa')
  .get()
```

will return:

```json
{
  "version": "1.0",
  "response": {
    "shouldEndSession": false,
    "outputSpeech": {
      "type": "PlainText",
      "ssml": "Hello from Alexa"
    }
  }
}
```

## Motivation

Building JSON responses manually is not fun and hard to read for a big JSON files. The main motivation for this message builder is to replace them with a simple and readable syntax. For example, instead of this JSON:
```json
{
  "version": "1.0",
  "response": {
    "shouldEndSession": false,
    "outputSpeech" : {
      "type": "PlainText",
      "text": "Alexa message builder is a simple message builder for Alexa responses"
    },
    "card": {
      "type": "Standard",
      "title": "Alexa Message Builder",
      "text": "Alexa message builder description",
      "image": {
        "smallImageUrl": "http://example.com/small-image-url.png",
        "largeImageUrl": "http://example.com/large-image-url.png"
      }
    }
  }
}
```

You can write following JavaScript code:
```javascript
new AlexaMessageBuilder()
  .addText('Alexa message builder is a simple message builder for Alexa responses')
  .addStandardCard('Alexa Message Builder', 'Alexa message builder description', {
    smallImageUrl: 'http://example.com/small-image-url.png',
    largeImageUrl: 'http://example.com/large-image-url.png'
  })
  .keepSession()
  .get()
```

Package can work with any Node.js project for building Alexa app. For example, it works perfectly with [Claudia Bot Builder](https://github.com/claudiajs/claudia-bot-builder):

```javascript
const BotBuilder = require('claudia-bot-builder'),
      AlexaMessageBuilder = require('alexa-message-builder')

module.exports = botBuilder(message => {
  return new AlexaMessageBuilder()
  	.addText('Hello from Alexa')
    .get()
}, {
  platforms: ['alexa']
})
```

## Documentation

Alexa Message Builder is still not covering 100% of Alexa JSON response, but it covers the big part of it. Here's how it works:

Require the package you previously installed from NPM:

```javascript
const AlexaMessageBuilder = require('alexa-message-builder')
```

or with `import`* syntax:

```javascript
import AlexaMessageBuilder from 'alexa-message-builder'
```

\* `import` syntax is not supported in Node.js, you need to use additional library like Babel to make it work.

After requiring it, you simply need to initialize the class, use any of available methods from the [documentation](#documentation) below and call `.get()` in the end. For Example:

```javascript
const AlexaMessageBuilder = require('alexa-message-builder')

const message = new AlexaMessageBuilder()
  .addText('Hello from Alexa')
  .get()
```

will return:

```json
{
  "version": "1.0",
  "response": {
    "shouldEndSession": false,
    "outputSpeech": {
      "type": "PlainText",
      "text": "Hello from Alexa"
    }
  }
}
```

### Add output speech

This generates the speech that Alexa will say as a reply to your question or command. It can be used as a response to a [LaunchRequest or IntentRequest](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-standard-request-types-reference).

You can send either plain text or [Speech Synthesis Markup Language (SSML)](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speech-synthesis-markup-language-ssml-reference).

#### Available methods

- addText
- addSSML

**addText** method can receive a plain text and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addText('A text that Alexa will use as a response')
  .get()
```

This method will throw an error if `text` is not provided.

**addSSML** method can receive a SSML message as a string and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addSSML('<speak>This output speech uses SSML.</speak>')
  .get()
```

This method will throw an error if `ssmlMessage` is not provided.

### Add reprompt

Similar to the output speech, reprompt supports both text and SSML, and it can be used as a response to a [LaunchRequest or IntentRequest](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-standard-request-types-reference).

#### Available methods

- addText
- addSSML

**addRepromptText** method can receive a plain text and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addRepromptText('A reprompt text that Alexa will use as a response')
  .get()
```

This method will throw an error if `text` is not provided.

**addRepromptSSML** method can receive a SSML message as a string and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addRepromptSSML('<speak>This reprompt speech uses SSML.</speak>')
  .get()
```

This method will throw an error if `ssmlMessage` is not provided.

### Add cards

Alexa supports 3 different types of the cards: Simple, Standard and LinkAccount. First two types are supported by this library.

Cards can only be included when sending a response to a [LaunchRequest or IntentRequest](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-standard-request-types-reference).

#### Add Simple card

Simple card is a card that contains a title and plain text content.

**addSimpleCard** method can receive title and text and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addText('A text that Alexa will use as a response')
  .addSimpleCard('Card title', 'Card text')
  .get()
```

This method will throw an error if both `title` and `text` are not provided.

#### Add Standard card

Standard card is a card that contains a title, text content, and an image to display.

**addStandardCard** method can receive title,  text and image object, and it returns a reference to `this` for chaining.

Example:

```javascript
new AlexaMessageBuilder()
  .addText('A text that Alexa will use as a response')
  .addStandardCard('Card title', 'Card text', {
    smallImageUrl: 'http://example.com/small-image-url.png',
    largeImageUrl: 'http://example.com/large-image-url.png'
  })
  .get()
```

This method will throw an error if `title`, `text` and `imageObject` are not provided.

### Keep the session opened

Alexa session will be closed by default, if you want to keep it opened use `.keepSession()` method.

**keepSession** method will keep the session opened. It doesn't require any params.

Example:

```javascript
new AlexaMessageBuilder()
  .addText('A text that Alexa will use as a response, and session will not be closed')
  .keepSession()
  .get()
```

### Add session attributes

Alexa also allows you to store some session attributes while the session is opened. To do so with a message builder use `.addSessionAttribute(key, value)` method.

**addSessionAttribute** method can receive key and value and it returns a reference to `this` for chaining. Key needs to be a string and value can be in other types too.

Example:

```javascript
new AlexaMessageBuilder()
  .addText('A text that Alexa will use as a response, and session will not be closed')
  .addSessionAttribute('someKey', 1)
  .keepSession()
  .get()
```

## TODO

- [ ] Add directives
- [ ] Add LinkAccount cards
- [ ] Check for limits

## Contribute

### Folder structure

The main body of code is in the [lib](lib) directory.

The tests are in the [spec](spec) directory, and should follow the structure of the corresponding source files. All executable test file names should end with `-spec`, so they will be automatically picked up by `npm test`. Any additional project files, helper classes etc that must not be directly executed by the test runner should not end with `-spec`. You can use the [spec/helpers](spec/helpers) directory to store Jasmine helpers, that will be loaded before any test is executed.

### Running tests

We use [Jasmine](https://jasmine.github.io/) for unit and integration tests. Unless there is a very compelling reason to use something different, please continue using Jasmine for tests. The existing tests are in the [spec](spec) folder. Here are some useful command shortcuts:

Run all the tests:

```bash
npm test
```

Run only some tests:

```bash
npm test -- filter=prefix
```

Get detailed hierarchical test name reporting:

```bash
npm test -- full
```

We use [ESLint](http://eslint.org/) for syntax consistency, and the linting rules are included in this repository. Running `npm test` will check the linting rules as well. Please make sure your code has no linting errors before submitting a pull request.

## License

MIT - See [LICENSE](LICENSE)
