"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

$().ready(function () {
  var rawdata = eval($('#smwdata').html());
  var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+,";
  var icon = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = $('#skillIcon').html().split('\n')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var i = _step.value;

      var _i$split = i.split(','),
          _i$split2 = _slicedToArray(_i$split, 2),
          name = _i$split2[0],
          path = _i$split2[1];

      icon[name] = path;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var servant = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = $('#servantData').html().split('<br/>')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _i3 = _step2.value;

      if (_i3) {
        var _i3$split = _i3.split('\t'),
            _i3$split2 = _slicedToArray(_i3$split, 3),
            id = _i3$split2[0],
            name = _i3$split2[1],
            path = _i3$split2[2];

        servant[parseInt(id)] = {
          "name": name,
          "path": path
        };
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var targets = ['自身', '己方单体', '己方全体', '敌方单体', '敌方全体', '除自身以外的己方全体', '其他'];
  var tbody = $('#tbody');
  var target_dropdown = $('#target-dropdown');
  var target_popper;
  var effect_dropdown = $('#effect-dropdown');
  var effect_popper;
  var result_tbody = $('#result-tbody');
  var skill_popup = $('#skill-popup');
  var skill_popper;
  var url = $('#skillUrl');
  var count = $('#count');
  var effects2targets = {};
  var targets2effects = {};
  var effects = new Set();
  {
    var wrongFormatSkills = [];
    var unKnownSkills = [];
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      var _loop = function _loop() {
        var v = _step3.value;
        var temp = [];

        if ((v.length - 6) % 11 !== 0) {
          wrongFormatSkills.push(v);
        }

        if (v[1].indexOf('未知技能') !== -1) {
          unKnownSkills.push(v);
        }

        v[1].replace(';skillData', '').split(';').forEach(function (value) {
          var _value$split = value.split(','),
              _value$split2 = _slicedToArray(_value$split, 2),
              target = _value$split2[0],
              effect = _value$split2[1];

          if (!target) {
            console.warn('has undefined target');
          } else if (!effect) {
            console.warn('has undefined effect');
          } else {
            (effects2targets[effect] = effects2targets[effect] || new Set()).add(target);
            (targets2effects[target] = targets2effects[target] || new Set()).add(effect);
            effects.add(effect);
            temp.push(value);
          }
        });
        (servant[v[0]].skills = servant[v[0]].skills || []).push({
          "cate": temp,
          "data": v
        });
      };

      for (var _iterator3 = rawdata[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (wrongFormatSkills.length !== 0) {
      $('#mw-content-text > div').prepend("\u4E0D\u6807\u51C6\u7684\u6280\u80FD\u6570\u636E\uFF1A<table><tbody><tr><th>\u4ECE\u8005\u540D</th><th>\u6280\u80FD\u540D</th></tr>".concat(Array.from(wrongFormatSkills.map(function (v) {
        return "<tr><td><a href=\"/w/".concat(servant[parseInt(v[0])].name, "\">").concat(servant[parseInt(v[0])].name, "</a></td><td>").concat(v[3], "</td></tr>");
      })).join(''), "</tbody></table>"));
    }

    if (unKnownSkills.length !== 0) {
      $('#mw-content-text > div').prepend("\u672A\u77E5\u6280\u80FD\uFF1A<table><tbody><tr><th>\u4ECE\u8005\u540D</th><th>\u6280\u80FD\u540D</th><th>\u7EC6\u8282</th></tr>".concat(Array.from(wrongFormatSkills.map(function (v) {
        return "<tr><td><a href=\"/w/".concat(servant[parseInt(v[0])].name, "\">").concat(servant[parseInt(v[0])].name, "</a></td><td>").concat(v[3], "</td><td><pre>").concat(JSON.stringify(v), "</pre></td></tr>");
      })).join(''), "</tbody></table>"));
    }

    effects = Array.from(effects).sort();
  }

  function buildEffectDropDown(str, target) {
    var temp = [];
    var e = target ? targets2effects[target] : Object.keys(effects2targets);
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = e[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var v = _step4.value;

        if (v.indexOf(str) !== -1) {
          temp.push("<div class=\"effect-dropdown-item\">".concat(v, "</div>"));
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return temp.join('');
  }

  function buildTargetDropDown(str, effect) {
    var t = effect ? effects2targets[effect] : targets;
    var temp = [];
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = t[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var v = _step5.value;

        if (v.indexOf(str) !== -1) {
          temp.push("<div class=\"target-dropdown-item\">".concat(v, "</div>"));
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return temp.join('');
  }

  var current_dropdown_target;
  target_dropdown.on('mousedown', '.target-dropdown-item', function (event) {
    current_dropdown_target.val($(event.currentTarget).html());
    filter();
  });
  effect_dropdown.on('mousedown', '.effect-dropdown-item', function (event) {
    current_dropdown_target.val($(event.currentTarget).html());
    filter();
  });
  tbody.on('click', '.remove', function (event) {
    var t = $(event.currentTarget).parents('tr');
    var prev = t.prev();

    if (t.next().length === 0) {
      prev.find('td:last').html('<button class="add">新增</button>');
      prev.attr('id', 'last-filter-row');
    }

    t.remove();

    if (tbody.find('tr').length === 2) {
      $('#last-filter-row').find('.remove').attr("disabled", "disabled");
    }

    filter();
  }).on('click', '.add', function () {
    var last_filter = $('#last-filter-row');
    last_filter.find('.add').remove();
    last_filter.find('.remove').removeAttr("disabled");
    last_filter.removeAttr("id");
    tbody.append("<tr class=\"filter-row\" id=\"last-filter-row\"><td><span class=\"label\">\u4F5C\u7528\u5BF9\u8C61</span><input type=\"text\" class=\"target\"></td><td><span class=\"label\">\u4F5C\u7528\u6548\u679C</span><input type=\"text\" class=\"effect\"></td><td><button class=\"remove\">\u5220\u9664</button></td><td><button class=\"add\">\u65B0\u589E</button></td></tr>");
  }).on('focus', '.target', function (event) {
    current_dropdown_target = $(event.currentTarget);
    target_dropdown.html(buildTargetDropDown('', current_dropdown_target.parent().next().find('.effect').val())).show('fast');
    target_popper = new Popper(event.currentTarget, target_dropdown, {
      placement: 'bottom-start'
    });
  }).on('input', '.target', function (event) {
    var t = $(event.currentTarget);
    var str = t.val();
    target_dropdown.html(buildTargetDropDown(str, t.parent().next().find('.effect').val()));
    filter();
  }).on('blur', '.target', function () {
    target_dropdown.hide('fast', function () {
      target_popper.destroy();
    });
  }).on('focus', '.effect', function (event) {
    current_dropdown_target = $(event.currentTarget);
    effect_dropdown.html(buildEffectDropDown('', current_dropdown_target.parent().prev().find('.target').val())).show('fast');
    effect_popper = new Popper(event.currentTarget, effect_dropdown, {
      placement: 'bottom-start'
    });
  }).on('input', '.effect', function (event) {
    var t = $(event.currentTarget);
    var str = t.val();
    effect_dropdown.html(buildEffectDropDown(str, t.parent().prev().find('.target').val()));
    filter();
  }).on('blur', '.effect', function () {
    effect_dropdown.hide('fast', function () {
      effect_popper.destroy();
    });
  });
  result_tbody.on('click', '.skillIcon', function (event) {
    var t = $(event.currentTarget);

    if (skill_popper && skill_popper.reference && t.is($(skill_popper.reference))) {
      return;
    }

    skill_popup.css('display', 'none');

    var _t$data$split = t.data('id').split(','),
        _t$data$split2 = _slicedToArray(_t$data$split, 2),
        servantId = _t$data$split2[0],
        skillId = _t$data$split2[1];

    skill_popup.html(buildSkill(servant[servantId].skills[skillId].data)).css('display', 'block');
    skill_popper = new Popper(event.currentTarget, skill_popup, {
      placement: 'right-start'
    });
  });
  document.addEventListener('click', function (event) {
    if (!event.target instanceof Element) {
      skill_popup.css('display', 'none');

      if (skill_popper) {
        skill_popper.destroy();
        skill_popper = undefined;
      }

      return;
    }

    var t = $(event.target);

    if (t.parents('#skill-popup').length !== 1 && !t.hasClass('skillIcon')) {
      skill_popup.css('display', 'none');

      if (skill_popper) {
        skill_popper.destroy();
        skill_popper = undefined;
      }
    }
  }, true);
  {
    var clipBoard = new ClipboardJS('#skillCopyUrl');
    clipBoard.on('success', function (e) {
      alert("链接已复制: " + e.text);
    });
    clipBoard.on('error', function (e) {
      console.error({
        copyUrlError: e
      });
    });
  }
  U2F();

  function filter() {
    var cond = [];
    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
      for (var _iterator6 = tbody.find('.filter-row')[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
        var e = _step6.value;
        var tar = $(e).find('.target');

        if (targets.includes(tar.val())) {
          tar.removeClass('border-red');
        } else {
          tar.addClass('border-red');
          return;
        }

        var eff = $(e).find('.effect');

        if (Object.keys(effects2targets).includes(eff.val())) {
          eff.removeClass('border-red');
        } else {
          eff.addClass('border-red');
          return;
        }

        cond.push("".concat(tar.val(), ",").concat(eff.val()));
      }
    } catch (err) {
      _didIteratorError6 = true;
      _iteratorError6 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
          _iterator6["return"]();
        }
      } finally {
        if (_didIteratorError6) {
          throw _iteratorError6;
        }
      }
    }

    console.log(cond);
    {
      var _temp = [];

      for (var _i2 = 0, _cond = cond; _i2 < _cond.length; _i2++) {
        var c = _cond[_i2];

        var _c$split = c.split(','),
            _c$split2 = _slicedToArray(_c$split, 2),
            tar = _c$split2[0],
            eff = _c$split2[1];

        _temp.push(targets.indexOf(tar).toString(2).padStart(3, '0'));

        _temp.push(effects.indexOf(eff).toString(2).padStart(7, '0'));
      }

      F2U(_temp.join(''));
    }

    if (cond.length === 0) {
      result_tbody.html('');
      return;
    }

    var resultObj = {};

    for (var s in servant) {
      for (var d in servant[s].skills) {
        var flag = true;
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = cond[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _c = _step7.value;

            if (!servant[s].skills[d]['cate'].includes(_c)) {
              flag = false;
              break;
            }
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
              _iterator7["return"]();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        if (flag) {
          (resultObj[s] = resultObj[s] || new Set()).add(d);
        }
      }
    }

    console.log(resultObj);
    var svt = 0;
    var skill = 0;
    var temp = "<tr><th style=\"width: 40px\">No.</th><th style=\"width: 100px;\">\u5934\u50CF</th><th style=\"width: 230px\">\u59D3\u540D</th><th style=\"width: 100px\">\u6280\u80FD\u56FE\u6807</th><th style=\"width: 230px\">\u6280\u80FD\u540D\u79F0</th></tr>";

    for (var i in resultObj) {
      ++svt;
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = resultObj[parseInt(i)][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var j = _step8.value;
          ++skill;
          temp += "<tr><td>".concat(i, "</td><td><a href=\"/w/").concat(servant[i]['name'], "\"><img class=\"svt-icon\" alt=\"").concat(servant[i]['name'], "\" src=\"").concat(servant[i]['path'], "\"></a></td><td><a href=\"/w/").concat(servant[i]['name'], "\">").concat(servant[i].name, "</a></td><td><img class=\"skillIcon\" alt=\"").concat(servant[i].skills[j]['data'][2], "\" data-id=\"").concat(i, ",").concat(j, "\" src=\"").concat(icon[servant[i].skills[j]['data'][2]], "\"></td><td><span>").concat(servant[i].skills[j]['data'][3], "</span></td>");
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }
    }

    count.html("\u5171".concat(svt, "\u4E2A\u4ECE\u8005,").concat(skill, "\u4E2A\u6280\u80FD"));
    result_tbody.html(temp);
  }

  function buildSkill(arr) {
    function build(arr) {
      var temp = [];
      var i = 6;

      while (i < arr.length) {
        arr[i] = arr[i].replace(/'"`UNIQ--ref-.*?-QINU`"'/, '');

        if ((i - 6) % 11 === 0) {
          temp.push("<tr><th colspan=\"10\">".concat(arr[i].replace(/<span class="tl-splink">(.*?)<\/span>/g, '$1').replace(/\[\[(.*?)\|(〔.*?〕)]]\[\[分类:对〔.*?〕具有特殊效果]]/g, "<span class=\"tl-splink\"><a href=\"/w/$1\" title=\"$1\">$2</a></span>"), "</th></tr><tr>"));
          ++i;
        } else {
          var tempArr = arr.slice(i, i + 10);
          i += 10;

          if (tempArr[1] === '') {
            temp.push("<td colspan=\"10\">".concat(tempArr[0], "</td>"));
          } else {
            tempArr.forEach(function (val) {
              temp.push("<td style=\"width:75px\">".concat(val, "</td>"));
            });
          }

          temp.push('</tr>');
        }
      }

      temp.push("</tr>");
      return temp.join('');
    }

    return "<table class=\"wikitable logo\" style=\"text-align:center;width:750px;margin: 0\"><tbody><tr><th rowspan=\"2\" style=\"width:75px\"><a href=\"\u6587\u4EF6:".concat(arr[2], ".png\" class=\"image\"><img alt=\"").concat(arr[2], "\" width=\"60\" height=\"60\" src=\"").concat(icon[arr[2]], "\"></a></th><th colspan=\"6\" style=\"width:450px\">").concat(arr[3], "</th><th rowspan=\"2\" colspan=\"3\" style=\"width:225px\">\u5145\u80FD\u65F6\u95F4\uFF1A").concat(arr[5], "\u2192<span style=\"color:red;\">").concat(parseInt(arr[5]) - 1, "</span>\u2192<span style=\"color:red;\">").concat(parseInt(arr[5]) - 2, "</span></th></tr><tr><td colspan=\"6\" lang=\"ja\">").concat(arr[4], "</td></tr>").concat(build(arr), "</tbody></table>");
  }

  function F2U(str) {
    str = str.padEnd(Math.ceil(str.length / 6) * 6, '0');
    var arr = [];

    for (var i = 0; i < str.length; i = i + 6) {
      arr.push(_keyStr[parseInt(str.slice(i, i + 6), 2)]);
    }

    var b64 = arr.join('');
    url.attr('value', "http://fgo.wiki/w/Widget:Skill?f=".concat(b64));
  }

  function U2F() {
    var u = new URLSearchParams(window.location.search).get('f');

    if (!u) {
      return;
    }

    var binArr = [];

    for (var i = 0; i < u.length; i++) {
      binArr = binArr.concat(_keyStr.indexOf(u[i]).toString(2).padStart(6, '0').split(''));
    }

    var temp = "";

    while (binArr.length >= 10) {
      var tar = binArr.splice(0, 3);
      var eff = binArr.splice(0, 7);
      tar = targets[parseInt(tar.join(''), 2)];
      eff = effects[parseInt(eff.join(''), 2)];

      if (binArr.length >= 10) {
        temp += "<tr class=\"filter-row\" id=\"last-filter-row\"><td><span class=\"label\">\u4F5C\u7528\u5BF9\u8C61</span><input type=\"text\" value=\"".concat(tar, "\" class=\"target\"></td><td><span class=\"label\">\u4F5C\u7528\u6548\u679C</span><input type=\"text\" value=\"").concat(eff, "\" class=\"effect\"></td><td><button class=\"remove\">\u5220\u9664</button></td><td></td></tr>");
      } else {
        temp += "<tr class=\"filter-row\" id=\"last-filter-row\"><td><span class=\"label\">\u4F5C\u7528\u5BF9\u8C61</span><input type=\"text\" value=\"".concat(tar, "\" class=\"target\"></td><td><span class=\"label\">\u4F5C\u7528\u6548\u679C</span><input type=\"text\" value=\"").concat(eff, "\" class=\"effect\"></td><td><button class=\"remove\">\u5220\u9664</button></td><td><button class=\"add\">\u65B0\u589E</button></td></tr>");
      }
    }

    tbody.find('.filter-row').remove();
    tbody.append(temp);

    if (tbody.find('tr').length === 2) {
      $('#last-filter-row').find('.remove').attr("disabled", "disabled");
    }

    filter();
  }
});