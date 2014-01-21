//模拟滚动条
var now_wheel = null;  
var scroller = function(a){  
    var self = this;  
    var timer;  
    this.container = document.getElementById("content"); // 容器  
    this.shower = document.getElementById("shower"); // 显示的内容  
    this.scroller = document.getElementById("scroller"); // 滚动条容器  
    this.scroll_up = document.getElementById("scroll_up"); // 上翻按钮  
    this.scroll_down = document.getElementById("scroll_down"); // 下翻按钮  
    this.scroll_bar = document.getElementById("scroll_bar"); // 滑动块  
    this.clearselect = window.getSelection ? function(){ window.getSelection().removeAllRanges(); } : function(){ document.selection.empty(); };  
    this.is_bottom = function(){ // 检测是不是位于底部了  
        if (self.shower.offsetTop <= self.container.offsetHeight-self.shower.offsetHeight){  
            return true;  
        }  
        return false;  
    }  
    this.resetright = function(){  
        var a = self.shower.offsetTop / (self.shower.offsetHeight - self.container.offsetHeight);  
        var b = self.scroller.offsetHeight - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight - self.scroll_up.offsetHeight;  
        var c = self.scroll_up.offsetHeight + (0 - b * a);  
        self.scroll_bar.style.top = c + "px";  
    }  
    this.resetleft = function(){  
        var a = (self.scroll_bar.offsetTop - self.scroll_up.offsetHeight) / (self.scroller.offsetHeight - self.scroll_up.offsetHeight - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight);  
        var b = self.shower.offsetHeight - self.container.offsetHeight;  
        var c = 0 - (b * a);  
        self.shower.style.top = c + "px";  
    }  
    this.move=function(a){  
        if (self.shower.offsetTop+a <= 0 && self.shower.offsetTop+a >= self.container.offsetHeight-self.shower.offsetHeight){  
            self.shower.style.top = (self.shower.offsetTop+a)+"px";  
        }else if (self.shower.offsetTop+a > 0){  
            self.shower.style.top = 0+"px";  
        }else if (self.shower.offsetTop+a < self.container.offsetHeight-self.shower.offsetHeight){  
            self.shower.style.top = self.container.offsetHeight-self.shower.offsetHeight+"px";  
        }  
        self.resetright();  
    }  
    this.upper = function(){  
        self.clear();  
        timer = window.setInterval(function(){self.move(2);}, 5);  
    }  
    this.downer = function(){  
        self.clear();  
        timer = window.setInterval(function(){self.move(-2);}, 5);  
    }  
    this.clear = function(){  
        window.clearInterval(timer);  
    }  
    this.test_bar = function(){  
        if (self.container.offsetHeight < self.shower.offsetHeight){  
            self.scroller.style.display = "block";  
        }else {  
            self.scroller.style.display = "none";  
        }  
    }  
    this.gotobottom = function(){  
        var a = (self.shower.offsetHeight > self.container.offsetHeight) ? self.container.offsetHeight - self.shower.offsetHeight : 0;  
        self.shower.style.top = a + "px";  
        self.test_bar();  
        self.resetright();  
    }  
    this.wheel = function(){  
        if (now_wheel == null) now_wheel =a;  
        if (now_wheel == a){  
            var e=arguments[0]||window.event;  
            var act = e.wheelDelta ? e.wheelDelta/120 : (0 -e.detail/3);  
            self.clear();  
            self.move(80*act);  
            try{ e.preventDefault();}  
            catch(e){}  
        }  
        window.setTimeout(function(){self.end_wheel();}, 1);  
        return false;  
    }  
    this.end_wheel = function(){  
        now_wheel = null;  
    }  
    this.barmove = function(){  
        // 记录当时鼠标的位置与  
        self.clearselect;  
        var mover = this;  
        this.can_move_top = self.scroll_bar.offsetTop - self.scroll_up.offsetHeight; // 这个滚动条上方的可移动距离  
        this.can_move_bottom = self.scroller.offsetHeight - self.scroll_bar.offsetTop - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight; // 这个滚动条下方的可移动距离  
        this.e=arguments[0]||window.event;  
        this.starts = this.e.clientY;  
        this.starttop = self.scroll_bar.offsetTop;  
        this.drag = function(){  
            this.e=arguments[0]||window.event;  
            this.ends = this.e.clientY;  
            this.dis = this.ends - mover.starts;  
            if (this.dis < (0-mover.can_move_top)) this.dis = 0-mover.can_move_top;  
            if (this.dis > mover.can_move_bottom) this.dis = mover.can_move_bottom;  
            self.scroll_bar.style.top = (mover.starttop + this.dis) + "px";  
            self.resetleft();  
            self.clearselect;  
        }  
        this.cleardrag = function(){  
            if (window.removeEventListener){  
                document.removeEventListener("mousemove", mover.drag, true);  
            }else {  
                document.detachEvent("onmousemove", mover.drag);  
            }  
            self.clearselect;  
        }  
        this.add_listener = function(){  
            if (window.addEventListener){  
                document.addEventListener("mousemove", mover.drag, true);  
                document.addEventListener("mouseup", mover.cleardrag, true);  
            }else {  
                document.attachEvent("onmousemove", mover.drag);  
                document.attachEvent("onmouseup", mover.cleardrag);  
            }  
        }  
        this.add_listener();  
    }  
    this.outbar = function(){  
        var e=arguments[0]||window.event;  
        var obj = e.srcElement ? e.srcElement : e.target;  
        if (obj.id == self.scroller.id){  
            var y = e.offsetY || e.layerY;  
            var new_top = y - 0.5 * self.scroll_bar.offsetHeight;  
            if (y - self.scroll_up.offsetHeight < 0.5 * self.scroll_bar.offsetHeight) new_top = self.scroll_up.offsetHeight;  
            if (self.scroller.offsetHeight - y - self.scroll_down.offsetHeight < 0.5 * self.scroll_bar.offsetHeight) new_top = self.scroller.offsetHeight - self.scroll_down.offsetHeight - self.scroll_bar.offsetHeight;  
            self.scroll_bar.style.top = new_top + "px";  
            self.resetleft();  
        }  
    }  
    this.scroll_bar.ondrag=function(){return false;}  
    this.scroll_bar.oncontextmenu=function(){return false;}   
    this.scroll_bar.onselectstart=function(){return false;}  
    if (window.addEventListener){  
        this.scroll_up.addEventListener("mousedown", this.upper, false);  
        this.scroll_down.addEventListener("mousedown", this.downer, false);  
        this.scroll_bar.addEventListener("mousedown", this.barmove, false);  
        this.scroller.addEventListener("mousedown", this.outbar, false);  
        this.container.parentNode.addEventListener("DOMMouseScroll", this.wheel, false);  
        this.container.parentNode.addEventListener("mousewheel", this.wheel, false);  
        document.addEventListener("mouseup", this.clear, false);  
    }else {  
        this.scroll_up.attachEvent("onmousedown", this.upper);  
        this.scroll_down.attachEvent("onmousedown", this.downer);  
        this.scroll_bar.attachEvent("onmousedown", this.barmove);  
        this.scroller.attachEvent("onmousedown", this.outbar);  
        this.container.parentNode.attachEvent("onmousewheel", this.wheel);  
        document.attachEvent("onmouseup", this.clear);  
        try{ window.event.cancelBubble=true;}  
        catch(e){}  
    }  
}  
var te = new scroller();  
/*  |xGv00|fd69ab298f65e23c7dac988f13943f2d */
