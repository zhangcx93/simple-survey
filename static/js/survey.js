//TODO: add error handling type
var simpleSurvey = function (selector, option) {
  var defaultOption = {
    method: "POST",
    url: window.location.href,
    submitText: "Submit",
    warningText: "Required",
  };

  var extend = function () {
    var obj, name, copy,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length;
    for (; i < length; i++) {
      if ((obj = arguments[i]) != null) {
        for (name in obj) {
          copy = obj[name];
          if (target === copy) {
            continue;
          }
          else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };

  return new simpleSurvey.fn(selector, extend(defaultOption, option))
}

simpleSurvey.fn = function (selector, option) {
  //init variables
  var that = this,
    result = {},
    div = document.createElement("div"),
    input = document.createElement("input"),
    form = document.createElement("form"),
    wrap = document.querySelector(selector),
    mainDiv = form.cloneNode(),
    list = option.list,
    length = option.list.length,
    i = 0,
    itemList = [];

  that.option = option;

  if (!wrap) {
    throw new Error("Cant find matched elements")
    return;
  }

  var initItem = function (dom, e) {
    //closure to save value and bind event for each list;
    var value = e.multi ? [] : "";

    var onChangeHandle = [],
      Check = [];
    var onChangeHandle = function (evt) {
      //get the value when things changed;
      if (evt.target.className.indexOf("survey-input") == -1) {
        return;
      }

      dom.querySelector(".survey-warning").innerHTML = "";

      if (e.type == "text" || e.type == "textarea") {
        value = dom.querySelector(".survey-input").value;
      }
      else {
        var checked = dom.querySelectorAll(":checked");
        value = [];
        for (var j = 0, l = checked.length; j < l; j++) {
          var tempValue;
          if (typeof e.selects[checked[j].value] != "string") {
            tempValue = checked[j].parentNode.querySelector("input[type=" +
              e.selects[checked[j].value].type || "text" + "]").value;
          }
          else {
            tempValue = checked[j].value;
          }
          if (e.multi) {
            value.push(tempValue);
          }
          else {
            value = tempValue;
          }
        }
      }

      if (e.onChange) {
        e.onChange(evt, value);
      }
    };

    var prevent = false;
    var onError = function (item, msg) {
      if (e.onError) {
        e.onError(item)
        if (prevent) {
          prevent = false;
          return;
        }
      }
      dom.querySelector(".survey-warning").innerHTML = msg;
    }

    dom.addEventListener("change", onChangeHandle, false)

    var getValue = function () {
      return value;
    }

    var preventDefault = function () {
      prevent = true;
    }

    return {
      id: e.id,
      list: e,
      itemDom: dom,
      getValue: getValue,
      onChangeHandle: onChangeHandle,
      preventDefault: preventDefault,
      onError: onError
    }
    //end of item
  }

  mainDiv.className = "survey-wrap";
  mainDiv.setAttribute("method", option.method);
  mainDiv.setAttribute("action", option.url);

  if (option.mainTitle) {
    var title = div.cloneNode();
    title.className = "survey-title";
    title.innerHTML = option.mainTitle || '';
    mainDiv.appendChild(title);
  }

  if (option.subTitle) {
    var subTitle = div.cloneNode();
    subTitle.className = "survey-subtitle";
    subTitle.innerHTML = option.subTitle || '';
    mainDiv.appendChild(subTitle);
  }

  for (; i < length; i++) {
    var itemDom = div.cloneNode(),
      itemTitle = div.cloneNode(),
      itemStatus = div.cloneNode(),
      item = list[i];
    itemDom.className = "survey-item";
    itemTitle.innerHTML = list[i].text;
    itemTitle.className = "survey-item-title";
    itemStatus.className = "survey-warning";
    itemDom.appendChild(itemTitle);
    itemDom.appendChild(itemStatus);

    if (!item.id) {
      throw new Error("id missed");
    }

    if (item.type == "text" || item.type == "textarea") {
      var itemInputWrap = div.cloneNode(),
        itemInput;
      if (item.type == "text") {
        itemInput = input.cloneNode();
        itemInput.type = item.type;
      }
      else {
        itemInput = document.createElement("textarea");
      }
      itemInputWrap.className = "survey-input-wrap";
      itemInput.className = "survey-input";
      itemInput.name = item.id;
      itemInputWrap.appendChild(itemInput);
      itemDom.appendChild(itemInputWrap);
    }
    else if (item.selects) {
      for (var select in item.selects) {
        var itemInputWrap = div.cloneNode(),
          itemInput = input.cloneNode();
        itemInputWrap.className = "survey-input-wrap";
        itemInput.className = "survey-input";
        itemInput.name = item.id;
        itemInput.type = item.multi ? "checkbox" : "radio";
        itemInput.value = select;
        itemInputWrap.appendChild(itemInput);
        if (item.selects[select].text) {
          var tempInput = input.cloneNode();
          tempInput.type = item.selects[select].type || "text";
          tempInput.className = "survey-input";
          itemInputWrap.insertBefore(tempInput, itemInput.nextSibling);
          itemInputWrap.insertBefore(document.createTextNode(item.selects[select].text),
            itemInput.nextSibling);
        }
        else {
          itemInputWrap.insertBefore(document.createTextNode(item.selects[select]),
            itemInput.nextSibling);
        }
        itemDom.appendChild(itemInputWrap);
      }
    }
    else {
      throw new Error("The item " + item.id + "missed selects or type");
      return;
    }

    itemList[i] = initItem(itemDom, item);
    mainDiv.appendChild(itemDom);
  }

  var submitButton = input.cloneNode();
  submitButton.setAttribute("type", "submit");
  submitButton.className = "survey-submit";
  submitButton.setAttribute("value", option.submitText);

  if (option.onSubmit) {
    var submit = function (evt) {
      for (var i = 0; i < itemList.length; i++) {
        result[itemList[i].id] = itemList[i].getValue();
        if ((itemList[i].getValue() == "" || itemList[i].getValue() == []) && !itemList[i].list.optional) {
          //not optional and not inputed
          evt.preventDefault();
          itemList[i].onError(itemList[i], option.warningText);
          option.onError(itemList[i], option.warningText);
          return;
        }
      }
      option.onSubmit(evt, result);
    }
  }
  mainDiv.addEventListener('submit', submit, false);
  mainDiv.appendChild(submitButton);

  wrap.appendChild(mainDiv);
}