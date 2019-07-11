var corpus_eng = [];
var corpus_hin = [];
var eng_ans = [];
var hin_ans = [];

var lang;
var accuracy;

// these 2 helper functions generate data from the text file.
function eng_gen() {
    var condition1 = function () {
        len_eng = corpus_eng.length;
        // console.log(len_eng)
        for (i = 0; i < len_eng; i++) {
            var temp = corpus_eng[i].split("\t");
            eng_ans.push(temp);
        }
    }
    $.when($.get("accuracies_english", function (data_eng) { corpus_eng = data_eng.split("\n") })).then(condition1);
}

function hin_gen() {
    var condition2 = function () {
        len_hin = corpus_hin.length;
        // console.log(len_hin)
        for (i = 0; i < len_hin; i++) {
            var temp = corpus_hin[i].split("\t");
            hin_ans.push(temp);
        }
    }
    $.when($.get("accuracies_hindi", function (data_hin) { corpus_hin = data_hin.split("\n") })).then(condition2);
}

eng_gen();
hin_gen();

// language selection and  display of dropdown
function display() {
    lang = document.getElementById("selectedEngorHin").value;

    $('#instruction').hide();
    if (lang == "") {
        $('#dropdown2').hide();
        $('#dropdown3').hide();
        $('#dropdown4').hide();
        $('#train').hide();
        $('#instruction').hide();
        $('#accuracy').hide();
        $('#ans').hide();
        alert("Select Language");
    }

    if (lang == "English") {
        $('#dropdown2').show();
        $('#dropdown3').show();
        $('#dropdown4').show();
        $('#train').show();
        $('#instruction').hide();
        $('#accuracy').hide();
        $('#ans').hide();
    }

    if (lang == "Hindi") {
        $('#dropdown2').show();
        $('#dropdown3').show();
        $('#dropdown4').show();
        $('#train').show();
        $('#instruction').hide();
        $('#accuracy').hide();
        $('#ans').hide();
    }
}

// gets input from user and trains the model accordingly
function train_model() {

    $('#ans').hide();
    buffer = [];
    size = document.getElementById("selectsize").value;
    algo = document.getElementById("selectalgo").value;
    feature = document.getElementById("selectfeature").value;

    buffer.push(size);
    buffer.push("");
    buffer.push(algo);
    buffer.push(feature);
    buffer.push("2k");
    buffer.push("");

    console.log(buffer);

    if (size == "" || algo == "" || feature == "") {
        alert("Field not selected");
    }
    else {

        if (lang == "English") {
            for (i = 0; i < eng_ans.length; i++) {
                count = 0;
                for (j = 0; j < 6; j++) {
                    if (eng_ans[i][j] == buffer[j]) {
                        count++;
                    }
                }
                if (count == 6) {
                    accuracy = eng_ans[i][6];
                    break;
                }
            }
        }

        if (lang == "Hindi") {
            for (i = 0; i < hin_ans.length; i++) {
                count = 0;
                for (j = 0; j < 6; j++) {
                    if (hin_ans[i][j] == buffer[j]) {
                        count++;
                    }
                }
                if (count == 6) {
                    accuracy = hin_ans[i][6];
                    break;
                }
            }
        }

        $('#instruction').show();
        $('#accuracy').show();
    }
}

// hides when values changed in dropdown
function hide_ins() {
    $('#instruction').hide();
    $('#accuracy').hide();
    $('#ans').hide();
}

// fetches accuracy
function get_accuracy() {
    $('#ans').show();
    document.getElementById("aans").innerHTML = accuracy;
}




