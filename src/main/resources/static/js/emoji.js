$(document).ready(function() {
     let emojiArea = $('.features-emoji').emojioneArea({
        pickerPosition: "top",
        standalone: true,
    });

    emojiArea[0].emojioneArea.on("emojibtn.click", function() {
        $("#message").first().append(this.editor.html());
    });
});


