// Globals
var submitTimerDecreaseInt;

$(document).ready(function() {
    CKEDITOR.replace('editor1');
    function getFile() {
        $.post("php/getFile.php").done(function( ret ) {
            window.ret = ret;
            window.setTimeout(function() {setData(ret)},500);
        });
    }
    function setData(data) {
        CKEDITOR.instances.editor1.setData(data, function() {
            this.checkDirty();  // true
        });
    }
    function getData() {
        return CKEDITOR.instances.editor1.getData();
    }
    var saveBtn = document.getElementById('saveButton');
    saveBtn.addEventListener('click',function(event) {
        event.preventDefault();
        var status = this.getAttribute("status");
        if (status == "default") {
            var THIS = this;
            this.setAttribute("status","warning");
            this.className = "armed";
            var startCount = 5;
            this.setAttribute("count",startCount);
            this.setAttribute("value","Are you sure? (" + startCount + ")");
            var decreaseTimer = function() {
                var curTime = THIS.getAttribute("count");
                curTime--;
                if (curTime > 0) {
                    THIS.setAttribute("count",curTime);
                    THIS.setAttribute("value","Are you sure? (" + curTime + ")");
                    return true;
                }	else if (curTime == 0)	{
                    THIS.setAttribute("count",-1);
                    THIS.setAttribute("value","Save file");
                    THIS.setAttribute("status","default");
                    THIS.className = "unArmed";
                    return false;
                }
            };
            var submitTimerDecreaseInt = window.setInterval(function() {
                var ret = decreaseTimer();
                if (ret == false) {
                    window.clearInterval(submitTimerDecreaseInt);
                }
            },1000);
        }	else if (status == "warning") {
            window.clearInterval(submitTimerDecreaseInt);
            this.className = "saving";
            this.setAttribute("value","Saving...");
            this.setAttribute("count",-1);
            this.setAttribute("status","saving");
            this.setAttribute("disabled",true);
            saveFile();
        }	else if (status == "saving") {
            console.log("Can't click the button while saving");
        }
    });
    function saveFile() {
        var htmlData = getData();
        $.post("php/setFile.php", {htmlData:htmlData,"title":title}).done(function() {
            saveBtn.setAttribute("value","File Saved!");
            window.setTimeout(function() {
                location.reload();
            },2000);
        });
    }
	function setNames() {
		$.ajax("naming.php")
		.done(function( ret ) {
			var retSplit = ret.split(",");
			for (var n = 0; n < retSplit.length; n++) {
                retSplit[n] = retSplit[n].split(":");
				window[retSplit[n][0]] = retSplit[n][1];
			}
			/* 
				var rootName = "shelved";
				var title = "Shelved Bugs";
			*/
			getFile();
        })
		.fail(function(e) {
			console.error(e);
			var errorMesg = "Cannot find directory names.";
			document.body.innerHTML = "<h2>Fatal Error:</h2>" + 
			"<p>" + errorMesg + "</p>" + 
			"<p>Call Jason</p>";
		});
	}	
	setNames();
});










