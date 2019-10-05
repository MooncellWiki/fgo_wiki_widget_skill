import Popper from "popper.js";
import $ from "jquery";
$().ready(function () {
    const rawdata = eval($('#smwdata').html());
    const _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+,";
    let icon = {};
    for (let i of $('#skillIcon').html().split('\n')) {
        let [name, path] = i.split(',');
        icon[name] = path;
    }
    const servant = {};
    for (let i of $('#servantData').html().split('<br/>')) {
        if (i) {
            let [id, name, path] = i.split('\t');
            servant[parseInt(id)] = {"name": name, "path": path}
        }
    }
    const targets = ['自身', '己方单体', '己方全体', '敌方单体', '敌方全体', '除自身以外的己方全体', '其他'];

    let tbody = $('#tbody');
    let target_dropdown = $('#target-dropdown');
    let target_popper;
    let effect_dropdown = $('#effect-dropdown');
    let effect_popper;
    let result_tbody = $('#result-tbody');
    let skill_popup = $('#skill-popup');
    let skill_popper;
    let url = $('#skillUrl');
    let count = $('#count');
    let isMobile=!!mw.config.get('wgMFMode');
    if(isMobile){
        $('.target,.effect').attr('readonly','');
    }
    let effects2targets = {};
    let targets2effects = {};
    let effects = new Set();
    {
        let wrongFormatSkills = [];
        let unKnownSkills = [];
        for (let v of rawdata) {
            let temp = [];
            if ((v.length - 6) % 11 !== 0) {
                wrongFormatSkills.push(v);
            }
            if (v[1].indexOf('未知技能') !== -1) {
                unKnownSkills.push(v);
            }
            v[1].replace(';skillData', '').split(';').forEach(function (value) {
                let [target, effect] = value.split(',');
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
            (servant[v[0]].skills = servant[v[0]].skills || []).push({"cate": temp, "data": v});
        }
        if (wrongFormatSkills.length !== 0) {
            $('#mw-content-text > div').prepend(`不标准的技能数据：<table><tbody><tr><th>从者名</th><th>技能名</th></tr>${Array.from(wrongFormatSkills.map(function (v) {
                return `<tr><td><a href="/w/${servant[parseInt(v[0])].name}">${servant[parseInt(v[0])].name}</a></td><td>${v[3]}</td></tr>`;
            })).join('')}</tbody></table>`);
        }
        if (unKnownSkills.length !== 0) {
            $('#mw-content-text > div').prepend(`未知技能：<table><tbody><tr><th>从者名</th><th>技能名</th><th>细节</th></tr>${Array.from(wrongFormatSkills.map(function (v) {
                return `<tr><td><a href="/w/${servant[parseInt(v[0])].name}">${servant[parseInt(v[0])].name}</a></td><td>${v[3]}</td><td><pre>${JSON.stringify(v)}</pre></td></tr>`;
            })).join('')}</tbody></table>`);
        }
        effects = Array.from(effects).sort();
    }
    function buildEffectDropDown(str, target) {
        let temp = [];
        let e = target ? targets2effects[target] : Object.keys(effects2targets);
        for (let v of e) {
            if (v.indexOf(str) !== -1) {
                temp.push(`<div class="effect-dropdown-item">${v}</div>`);
            }
        }
        return temp.join('');
    }

    function buildTargetDropDown(str, effect) {
        let t = effect ? effects2targets[effect] : targets;
        let temp = [];
        for (let v of t) {
            if (v.indexOf(str) !== -1) {
                temp.push(`<div class="target-dropdown-item">${v}</div>`);
            }
        }
        return temp.join('');
    }

    let current_dropdown_target;

    target_dropdown.on('mousedown', '.target-dropdown-item', function (event) {
        current_dropdown_target.val($(event.currentTarget).html());
        filter();
    });
    effect_dropdown.on('mousedown', '.effect-dropdown-item', function (event) {
        current_dropdown_target.val($(event.currentTarget).html());
        filter();
    });
    tbody.on('click', '.remove', function (event) {
        let t = $(event.currentTarget).parents('tr');
        let prev = t.prev();
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
        let last_filter = $('#last-filter-row');
        last_filter.find('.add').remove();
        last_filter.find('.remove').removeAttr("disabled");
        last_filter.removeAttr("id");
        tbody.append(`<tr class="filter-row" id="last-filter-row"><td><span class="label">作用对象</span><input type="text" class="target" ${(isMobile?'readonly':'')}></td><td><span class="label">作用效果</span><input type="text" class="effect" ${(isMobile?'readonly':'')}></td><td><button class="remove">删除</button></td><td><button class="add">新增</button></td></tr>`);
    }).on('focus', '.target', function (event) {
        current_dropdown_target = $(event.currentTarget);
        target_dropdown.html(buildTargetDropDown('', current_dropdown_target.parent().next().find('.effect').val())).show('fast');
        target_popper = new Popper(event.currentTarget, target_dropdown, {
            placement: 'bottom-start'
        });
    }).on('input', '.target', function (event) {
        let t = $(event.currentTarget);
        let str = t.val();
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
        let t = $(event.currentTarget);
        let str = t.val();
        effect_dropdown.html(buildEffectDropDown(str, t.parent().prev().find('.target').val()));
        filter();
    }).on('blur', '.effect', function () {
        effect_dropdown.hide('fast', function () {
            effect_popper.destroy();
        });
    });

    result_tbody.on('click', '.skillIcon', function (event) {
        let t = $(event.currentTarget);
        if (skill_popper && skill_popper.reference && t.is($(skill_popper.reference))) {
            return;
        }
        skill_popup.css('display', 'none');
        let [servantId, skillId] = t.data('id').split(',');
        skill_popup.html(buildSkill(servant[servantId].skills[skillId].data)).css('display', 'block');
        skill_popper = new Popper(event.currentTarget, skill_popup, {
            placement: 'right-start',
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
        let t = $(event.target);
        if (t.parents('#skill-popup').length !== 1 && !t.hasClass('skillIcon')) {
            skill_popup.css('display', 'none');
            if (skill_popper) {
                skill_popper.destroy();
                skill_popper = undefined;
            }
        }
    }, true);
    {
        let clipBoard = new ClipboardJS('#skillCopyUrl');
        clipBoard.on('success', function (e) {
            alert("链接已复制: " + e.text);
        });
        clipBoard.on('error', function (e) {
            console.error({copyUrlError: e});
        });
    }
    U2F();

    function filter() {
        let cond = [];
        for (let e of tbody.find('.filter-row')) {
            let tar = $(e).find('.target');
            if (targets.includes(tar.val())) {
                tar.removeClass('border-red');
            } else {
                tar.addClass('border-red');
                return;
            }
            let eff = $(e).find('.effect');
            if (Object.keys(effects2targets).includes(eff.val())) {
                eff.removeClass('border-red');
            } else {
                eff.addClass('border-red');
                return;
            }
            cond.push(`${tar.val()},${eff.val()}`);
        }
        console.log(cond);
        {
            let temp = [];
            for (let c of cond) {
                let [tar, eff] = c.split(',');
                temp.push(targets.indexOf(tar).toString(2).padStart(3, '0'));
                temp.push(effects.indexOf(eff).toString(2).padStart(7, '0'));
            }
            F2U(temp.join(''));
        }
        if (cond.length === 0) {
            result_tbody.html('');
            return;
        }
        let resultObj = {};
        for (let s in servant) {
            for (let d in servant[s].skills) {
                let flag = true;
                for (let c of cond) {
                    if (!servant[s].skills[d]['cate'].includes(c)) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    (resultObj[s] = resultObj[s] || new Set()).add(d);
                }
            }
        }
        console.log(resultObj);
        let svt = 0;
        let skill = 0;
        let temp = `<tr><th style="width: 40px">No.</th><th style="width: 100px;">头像</th><th style="width: 230px">姓名</th><th style="width: 100px">技能图标</th><th style="width: 230px">技能名称</th></tr>`;
        for (let i in resultObj) {
            ++svt;
            for (let j of resultObj[parseInt(i)]) {
                ++skill;
                temp += `<tr><td>${i}</td><td><a href="/w/${servant[i]['name']}"><img class="svt-icon" alt="${servant[i]['name']}" src="${servant[i]['path']}"></a></td><td><a href="/w/${servant[i]['name']}">${servant[i].name}</a></td><td><img class="skillIcon" alt="${servant[i].skills[j]['data'][2]}" data-id="${i},${j}" src="${icon[servant[i].skills[j]['data'][2]]}"></td><td><span>${servant[i].skills[j]['data'][3]}</span></td>`
            }
        }
        count.html(`共${svt}个从者,${skill}个技能`);
        result_tbody.html(temp);
    }

    function buildSkill(arr) {
        function build(arr) {
            let temp = [];
            let i = 6;
            while (i < arr.length) {
                arr[i] = arr[i].replace(/'"`UNIQ--ref-.*?-QINU`"'/, '');
                if ((i - 6) % 11 === 0) {
                    temp.push(`<tr><th colspan="10">${arr[i].replace(/<span class="tl-splink">(.*?)<\/span>/g, '$1').replace(/\[\[(.*?)\|(〔.*?〕)]]\[\[分类:对〔.*?〕具有特殊效果]]/g, `<span class="tl-splink"><a href="/w/$1" title="$1">$2</a></span>`)}</th></tr><tr>`);
                    ++i;
                } else {
                    let tempArr = arr.slice(i, i + 10);
                    i += 10;
                    if (tempArr[1] === '') {
                        temp.push(`<td colspan="10">${tempArr[0]}</td>`);
                    } else {
                        tempArr.forEach(function (val) {
                            temp.push(`<td style="width:75px">${val}</td>`);
                        });
                    }
                    temp.push('</tr>');
                }
            }
            temp.push(`</tr>`);
            return temp.join('');
        }
        return `<table class="wikitable logo" style="text-align:center;width:750px;margin: 0"><tbody><tr><th rowspan="2" style="width:75px"><a href="/w/文件:${arr[2]}.png" class="image"><img alt="${arr[2]}" width="60" height="60" src="${icon[arr[2]]}"></a></th><th colspan="6" style="width:450px">${arr[3]}</th><th rowspan="2" colspan="3" style="width:225px">充能时间：${arr[5]}→<span style="color:red;">${parseInt(arr[5]) - 1}</span>→<span style="color:red;">${parseInt(arr[5]) - 2}</span></th></tr><tr><td colspan="6" lang="ja">${arr[4]}</td></tr>${build(arr)}</tbody></table>`;
    }

    function F2U(str) {
        str = str.padEnd(Math.ceil(str.length / 6) * 6, '0');
        let arr = [];
        for (let i = 0; i < str.length; i = i + 6) {
            arr.push(_keyStr[parseInt(str.slice(i, i + 6), 2)]);
        }
        let b64 = arr.join('');
        url.attr('value', `http://fgo.wiki/w/SvtSkill?f=${b64}`);
    }

    function U2F() {
        let u = new URLSearchParams(window.location.search).get('f');
        if (!u) {
            return;
        }
        let binArr = [];
        for (let i = 0; i < u.length; i++) {
            binArr = binArr.concat(_keyStr.indexOf(u[i]).toString(2).padStart(6, '0').split(''));
        }
        let temp = "";
        while (binArr.length >= 10) {
            let tar = binArr.splice(0, 3);
            let eff = binArr.splice(0, 7);
            tar = targets[parseInt(tar.join(''), 2)];
            eff = effects[parseInt(eff.join(''), 2)];
            if (binArr.length >= 10) {
                temp += `<tr class="filter-row" id="last-filter-row"><td><span class="label">作用对象</span><input type="text" value="${tar}" class="target" ${(isMobile?'readonly':'')}></td><td><span class="label">作用效果</span><input type="text" value="${eff}" class="effect" ${(isMobile?'readonly':'')}></td><td><button class="remove">删除</button></td><td></td></tr>`;
            } else {
                temp += `<tr class="filter-row" id="last-filter-row"><td><span class="label">作用对象</span><input type="text" value="${tar}" class="target" ${(isMobile?'readonly':'')}></td><td><span class="label">作用效果</span><input type="text" value="${eff}" class="effect" ${(isMobile?'readonly':'')}></td><td><button class="remove">删除</button></td><td><button class="add">新增</button></td></tr>`;
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
