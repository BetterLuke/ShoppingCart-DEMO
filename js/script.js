/**
 * [模拟队列的方式添加多个事件到onload事件中]
 * @param {[type]} func [description]
 */
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

/**
 * [通过类名获取元素集，并解决了低版本IE对于此方法的不兼容问题]
 * @param  {[string]} className [描述类名的字符串]
 * @return {[元素数组]}           [含有相同类型名的元素数组]
 */
function getElementsByClassName(className) {
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function(className) {
            var ret = [];
            var els = document.getElementsByTagName('*');
            for (var i = 0, len = els.length; i < len; i++) {
                if (els[i].className == className || els[i].className.indexOf(className + ' ') != -1 ||
                    els[i].className.indexOf(' ' + className) != -1 ||
                    els[i].className.indexOf(' ' + className + ' ') != -1) {
                    ret.push(els[i]);
                }
            }
        }
    }
    return ret;
}

/**
 * [处理单选和全选条目的checkbox，完成总价计算，与已选商品计算]
 * @return {[type]} [description]
 */
function selectItem() {
    var cartTable = document.getElementById('cartTable');
    var trs = cartTable.children[1].rows;
    var checkInputs = document.getElementsByClassName('check');
    //console.log(checkInputs.length);
    var selectedTotal = document.getElementById('selectedTotal');
    var priceTotal = document.getElementById('priceTotal');
    var foot = document.getElementById('foot');
    var selectedViewList = document.getElementById('selectedViewList');
    var deleteAll = document.getElementById('deleteAll');

    function getTotal() {
        var selected = 0;
        var price = 0;
        var HTMLstr = '';
        for (var j = 0; j < trs.length; j++) {
            if (trs[j].getElementsByTagName('input')[0].checked) {
                trs[j].className = 'on';
                selected += parseInt(trs[j].getElementsByTagName('input')[1].value);
                price += parseFloat(trs[j].cells[4].innerHTML);
                HTMLstr += '<div><img src="' + trs[j].getElementsByTagName('img')[0].src +
                    '"><span  class="del" index="' + j + '">取消选择</span></div>';
            } else {
                trs[j].className = '';
            }
        }
        selectedTotal.innerHTML = selected;
        priceTotal.innerHTML = price.toFixed(2);
        selectedViewList.innerHTML = HTMLstr;
        if (selected == 0) {
            foot.className == 'foot';
        }
    }



    for (var r = 0; r < trs.length; r++) {
        trs[r].onclick = function(e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1];
            var val = parseInt(input.value);
            var reduceButton = this.getElementsByClassName('reduce')[0];
            var addButton = this.getElementsByClassName('add')[0];

            switch (cls) {
                case 'add':
                    val += 1;
                    input.value = val;
                    reduceButton.innerHTML = '-';
                    getsubTotal(this);
                    break;
                case 'reduce':
                    if (val > 1) {
                        val -= 1;
                    }
                    if (val <= 1) {
                        reduceButton.innerHTML = '';
                    }
                    input.value = val;
                    getsubTotal(this);
                    break;
                case 'delete':
                    var conf = confirm("确定要删除吗？");
                    if (conf) {
                        this.parentNode.removeChild(this);
                    }

                default:
                    break;
            }
            getTotal();
        }

        trs[r].getElementsByTagName('input')[1].onkeyup = function() {
            var val = parseInt(this.value);
            var tr = this.parentNode.parentNode;
            var reduce = tr.getElementsByTagName('span')[1];
            if (isNaN(val) || val < 1) {
                val = 1;
            }
            this.value = val;
            if (val <= 1) {
                reduce.innerHTML = '';
            } else {
                reduce.innerHTML = '-';
            }
            getsubTotal(tr);
        }

    }




    for (var i = 0; i < checkInputs.length; i++) {
        checkInputs[i].onclick = function() {
            if (this.className == 'check-all check') {
                //console.log(1)
                for (var n = 0; n < checkInputs.length; n++) {
                    checkInputs[n].checked = this.checked;
                }
            }
            if (this.checked == false) {
                //console.log(2);
                for (var k = 0; k < checkAllInputs.length; k++) {
                    checkAllInputs[k].checked = false;
                }
            }
            getTotal();
        }
    }

    selected.onclick = function() {
        if (foot.className == 'foot' && parseInt(selectedTotal.innerHTML) != 0) {
            foot.className = 'foot show';
        } else {
            foot.className = 'foot';
        }
    }

    selectedViewList.onclick = function(e) {
        e = e || window.event;
        var el = e.srcElement;
        if (el.className == 'del') {
            var index = el.getAttribute('index');
            var input = trs[index].getElementsByTagName('input')[0];
            input.checked = false;
            input.onclick();
        }
    }

    deleteAll.onclick = function() {
        if (selectedTotal.innerHTML != 0) {
            var conf = confirm("确定要删除吗？");
            if (conf) {
                for (var i = 0; i < trs.length; i++) {
                    var input = trs[i].getElementsByTagName('input')[0];
                    if (input.checked) {
                        trs[i].parentNode.removeChild(trs[i]);
                        i--;
                    }
                }
            }
        }

    }


}

function getsubTotal(tr) {
    var tds = tr.cells;
    var price = parseFloat(tds[2].innerHTML);
    var count = parseFloat(tr.getElementsByTagName('input')[1].value);
    var subTatal = parseFloat(price * count);
    tds[4].innerHTML = subTatal.toFixed(2);
}





addLoadEvent(selectItem);
