/*
The MIT License (MIT)

Copyright (c) 2016 Patricio Gonzalez Vivo ( http://www.patriciogonzalezvivo.com )

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import xhr from 'xhr';

export default class GlslGallery {
    constructor(selector, options) {

        if (typeof selector === 'object' && selector.nodeType && selector.nodeType === 1) {
            this.container = selector;
        }
        else if (typeof selector === 'string') {
            this.container = document.querySelector(selector);
        }
        else {
            console.log('Error, type ' + typeof selector + ' of ' + selector + ' is unknown');
            return;
        }

        options = options || {};

        if (selector.hasAttribute('data')) {
            let logs = selector.getAttribute('data').split(',');
            for (let i in logs) {
                let item = document.createElement('div');
                item.setAttribute('class', 'glslGallery_item');
                item.innerHTML = '<a href="http://player.thebookofshaders.com/?log='+logs[i]+'" data='+logs[i]+' target="_blank" onmouseenter="GlslGallery_mouseIn(this)" onmouseleave="GlslGallery_mouseOut(this)"> <img class="glslGallery_thumb" src="http://thebookofshaders.com/log/'+logs[i]+'.png"></a>';
                this.container.appendChild(item);
            }
        }

        return this;
    }

    version() {
        return '0.0.1';
    }
}

window.GlslGallery = GlslGallery;

function GlslGallery_loadAll() {
    var list = document.getElementsByClassName('glslGallery');
    if (list.length>0) {
        window.glslGalleries = [];
        for (var i = 0; i < list.length; i++) {
            var gallery = new GlslGallery(list[i]);
            window.glslGalleries.push(gallery);
        }
    }
}

function GlslGallery_mouseIn (el) {
    var img = el.getElementsByTagName('img');

    var url = 'http://thebookofshaders.com/log/' + el.getAttribute('data') + '.frag';
    xhr.get(url, (error, res, body) => {
        if (error) {
            console.error('Error downloading ', shader, error);
            return;
        }
        window.glslGallery_canvas.load(body);

        let bbox = el.getBoundingClientRect();
        window.glslGallery_canvas.canvas.style.height = img[0].offsetHeight + 'px';
    });

    el.appendChild(window.glslGallery_canvas.canvas);
} 


function GlslGallery_mouseOut (el) {
    el.removeChild(window.glslGallery_canvas.canvas);
}

window.onload = function () { 
    if (!window.glslGallery_canvas) {
        var canvas = document.createElement("canvas");
        canvas.setAttribute('class','glslGallery_canvas');
        canvas.style.width = '250px';
        canvas.style.height = '250px';
        canvas.width = '250px';
        canvas.height = '250px';

        window.glslGallery_canvas = new GlslCanvas(canvas);
    }

    if (!window.GlslGallery_mouseIn) {
        window.GlslGallery_mouseIn = GlslGallery_mouseIn;
    }

    if (!window.GlslGallery_mouseOut) {
        window.GlslGallery_mouseOut = GlslGallery_mouseOut;
    }

    GlslGallery_loadAll();
};
