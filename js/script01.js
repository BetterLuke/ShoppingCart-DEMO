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
 * [获取carttable中的所有包含商品的行]
 * @return {[type]} [返回所有包含商品的行数组]
 */
function getAllGoodsItems() {
    var cartTable = document.getElementById('cartTable');
    var trs = cartTable.children[1].rows;
    return trs;
}

function getAllCheckInputs() {
    var checkInputs = document.getElementsByClassName('check');
    return checkInputs;
}

/**
 * [修改input值,并自动修改所在行的css，突显选中效果]
 * @param  {[type]} tr [description]
 * @return {[type]}    [description]
 */
function changeInputChecked(trs) {
    for (var i = 0; i < trs.length; i++) {
        if (trs[i].getElementsByTagName('input')[0].checked) {
            trs[i].className = 'on';
        } else {
            trs[i].className = '';
        }
    }
}

/**
 * [计算已选择的总件数]
 * @return {[type]} [description]
 */
function getSelectedTotalCount(trs) {
    var selected = 0;
    for (var i = 0; i < trs.length; i++) {
        if (trs[i].getElementsByTagName('input')[0].checked) {
            selected += parseInt(trs[i].getElementsByTagName('input')[1].value);
        }
    }
    return selected;
}

/**
 * [计算已选择的总价]
 * @param  {[type]} trs [description]
 * @return {[type]}     [description]
 */
function getPriceTotalCount(trs) {
    var price = 0;
    for (var i = 0; i < trs.length; i++) {
        if (trs[i].getElementsByTagName('input')[0].checked) {
            price += parseFloat(trs[i].cells[4].innerHTML);
        }
    }
    return price;
}

/**
 * [处理单选和全选条目的checkbox，修改classname以高亮显示]
 * @return {[type]} [description]
 */
function selectItem() {
    var trs = getAllGoodsItems();
    var checkInputs = getAllCheckInputs();
    var checkAllInputs = document.getElementsByClassName('check-all');
    console.log(checkAllInputs);

    //为每行的第一个input元素绑定onclick事件
    for (var i = 0; i < checkInputs.length; i++) {
        checkInputs[i].onclick = function() {
            if (this.className == 'check-all check') { //如果是全选input
                for (var n = 0; n < checkInputs.length; n++) {
                    checkInputs[n].checked = this.checked;
                }
            }
            if (this.checked == false) { //取消全选input
                for (var k = 0; k < checkAllInputs.length; k++) {
                    checkAllInputs[k].checked = false;
                }
            }
            changeInputChecked(trs); //检查inpout的check如果改变，则动态改变所在行的css
            updateInnerHTMLForPriceTotalSelectedTotal(trs); //计算并修改修改页面中的数字
            setSelectedViewList(trs);
        }
    }
}

/**
 * [计算总价并修改页面中的数字]
 */
function updateInnerHTMLForPriceTotalSelectedTotal(trs) {
    var selectedCount = getSelectedTotalCount(trs);
    var priceCount = getPriceTotalCount(trs);
    var slectedTotal = document.getElementById('slectedTotal');
    var priceTotal = document.getElementById('priceTotal');
    selectedTotal.innerHTML = selectedCount;
    priceTotal.innerHTML = priceCount.toFixed(2);
}

/**
 * [计算小计并显示到网页中]
 */
function getsubTotal(tr) {
    var tds = tr.cells;
    var price = parseFloat(tds[2].innerHTML);
    var count = parseInt(tr.getElementsByTagName('input')[1].value);
    var subTatal = parseFloat(price * count);
    tds[4].innerHTML = subTatal.toFixed(2);
}

/**
 * [处理每个商品行里的按钮事件]
 */
function setItemButtonEvent() {
    var trs = getAllGoodsItems();
    for (var i = 0; i < trs.length; i++) {
        trs[i].onclick = function(e) {
            e = e || window.event;
            var el = e.srcElement;
            var cls = el.className;
            var input = this.getElementsByTagName('input')[1];
            var val = parseInt(input.value);
            var reduceButton = this.getElementsByClassName('reduce')[0];
            var addButton = this.getElementsByClassName('add')[0];
            switch (cls) {
                case 'reduce':
                    if (val > 1) {
                        val -= 1;
                    } else if (val <= 1) {
                        reduceButton.innerHTML = '';
                    }
                    input.value = val;
                    getsubTotal(this);
                    break;
                case 'add':
                    val += 1;
                    input.value = val;
                    reduceButton.innerHTML = '-';
                    getsubTotal(this);
                    break;
                case 'delete':
                    var conf = confirm("确定要删除吗？");
                    if (conf) {
                        this.parentNode.removeChild(this);
                    }
                    break;
                default:
                    // statements_def
                    break;
            }
            updateInnerHTMLForPriceTotalSelectedTotal(trs);
        }
    }
}

/**
 * [绑定键盘触发事件，屏蔽非数字输入和无效输入]
 */
function setOnkeyupEvent() {
    var trs = getAllGoodsItems();
    for (var i = 0; i < trs.length; i++) {
        trs[i].getElementsByTagName('input')[1].onkeyup = function() {
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
}

/**
 * [绑定查看已选箭头的点击事件]
 */
function setSelectedOnclickEvent() {
    var selected = document.getElementById('selected');
    selected.onclick = function() {
        if (foot.className == 'foot' && parseInt(selectedTotal.innerHTML) != 0) {
            foot.className = 'foot show';
        } else {
            foot.className = 'foot';
        }
    }
}

/**
 * [为已选商品的预览窗口添加代理事件]
 */
function setSelectedViewListOnclickEvent() {
    var trs = getAllGoodsItems();
    var selectedViewList = document.getElementById('selectedViewList');
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
}

/**
 * [设置预览窗口]
 * @param {[type]} trs [description]
 */
function setSelectedViewList(trs) {
    //console.log('OK');
    var selectedViewList = document.getElementById('selectedViewList');
    //var trs = getAllGoodsItems();
    var HTMLstr = '';
    for (var i = 0; i < trs.length; i++) {
        if (trs[i].getElementsByTagName('input')[0].checked) {
            HTMLstr += '<div><img src="' + trs[i].getElementsByTagName('img')[0].src +
                '"><span  class="del" index="' + i + '">取消选择</span></div>';
        }

    }
    selectedViewList.innerHTML = HTMLstr;
    if (selected == 0) {
        foot.className == 'foot';
    }
}

/**
 * [处理多选的删除]
 */
function deleteallButtonEvent() {
	var trs = getAllGoodsItems();
    var deleteAll = document.getElementById('deleteAll');
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

 //依次添加到onload事件中
addLoadEvent(selectItem);
addLoadEvent(setItemButtonEvent);
addLoadEvent(setOnkeyupEvent);
addLoadEvent(setSelectedOnclickEvent);
addLoadEvent(setSelectedViewListOnclickEvent);
addLoadEvent(deleteallButtonEvent);
