$(document).ready(function() {
    $('.features-bold').click(function() {
        document.execCommand('bold');
    });
});

$(document).ready(function() {
    $('.features-italic').click(function() {
        document.execCommand('italic');
    });
});

$(document).ready(function() {
    $('.features-underline').click(function() {
        document.execCommand('underline');
    });
});


$(document).ready(()=>{
    var activeFontSize = 12;
    var oDoc = document.getElementById("message");
    var style = document.createElement("style");
    document.body.appendChild(style);

    function setFontSize(value){
        $editor.focus();
        document.execCommand("fontsize", false, 12);
        activeFontSize = value;
        createStyle();
        updateTags();
    }

    function updateTags(){
        var fontElements = oDoc.getElementsByTagName("font");
        for (var i = 0, len = fontElements.length; i < len; ++i) {
            if (fontElements[i].size == "7") {
                fontElements[i].removeAttribute("size");
                fontElements[i].style.fontSize = activeFontSize+"px";
            }
        }
    }

    function createStyle(){
        style.innerHTML = '#editor font[size="7"]{font-size: '+activeFontSize+'px}';
    }

    function updateToolBar(args){
        $fontSize.val(args.fontsize);
    }

    var $fontSize = $("#fontSize");
    var $editor = $("#message");

    $fontSize.on("change", ()=>{
        setFontSize($fontSize.val());
    });

    $editor.on("keyup", ()=>{
        updateTags();
    });

    $editor.on("keyup mousedown", (e)=>{
        try{
            var fontsize = $(window.getSelection().getRangeAt(0).startContainer.parentNode).css("font-size");
            fontsize = fontsize.replace("px", "");
            updateToolBar({fontsize})
        }catch(e){
            console.log("exception", e)
        }
    });

    oDoc.focus();
    setFontSize(12);
});