# Simple-Survey - Generate survey with JSON
Simple-survey is a easy to use javascript plugin to automatically generate sruvey form, which provide sophisticated dom structure and some event bindings, error checkings.  
## Features
- Pure javascript without dependency
- Title and Subtitle Supported
- Generate single select, multiple select(with optional text feedback), text input, textarea with JSON
- Use form post by default, output JSON result for ajax submit
- Basic error checking for requried input
- Easy customize with **onSubmit** **onChange** **onError** handler, use preventDefault as you wish.

## Example
```js
  simpleSurvey(".survey", {
    mainTitle: "This is a survey demo",//main title, optional
    subTitle: "Simple-survey is a easy to use javascript plugin to automatically generate sruvey form, which provide sophisticated dom structure and some event bindings, error checkings.",//subTitle, optional
    url: "/",//string, default: window.location.href
    onSubmit: function (e, result) {//handler onsubmit
      e.preventDefault();//cancle form submit manually
      console.log(result);//log out json result
    },
    submitText: "OK Submit", //default: Submit, use for localization, text for submit button
    warningText: "You must write this", //default: Required
    list:[{ //contain all item of survey
      id: "1",//id is for the NAME of a input
      text: "1. question one?", //title of a question
      selects: { //object, key for value of input, value for text of option
      "a": "A YES", 
      "b": "B NO",
      "na": "C Whatever"
      },
      onError: function (e) {
        e.preventDefault();
        console.log(e.target);
      }
  },{
      id: "2",
      text: "2.Second question（multiple）",
      selects: {
      "a": "A Good",
      "b": "B Bad",
      "other": {
        text: "Something Else:",
        type: "text"
      }
    },
    multi: true//set this for multiple choice
  },{
    id:"email",
    text: "Email",
    type: "text",
    onChange: function (e, value) {
      console.log(value);
    }
  }]
})
```

## Feedback

Developer: zhangcx93(zhangcx93@gmail.com)