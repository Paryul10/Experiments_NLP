var corpus_eng = [];
var corpus_hin = [];
var eng_ans = [];
var hin_ans = [];
var english = [];
var hindi = [];

var lang;
var category = ["verb", "noun", "na"];
var gender = ["male", "female", "na"];
var number = ["singular", "plural", "na"];
var person = ["first", "second", "third", "na"];
var case_opt = ["direct", "oblique", "na"];
var tense = ["simple-present", "simple-future", "present-continuous", "past-continuous", "future-continuous", "present-perfect-continuous", "past-perfect-continuous", "future-perfect-continuous", "simple-past", "present-perfect", "past-perfect", "future-perfect", "na"];

var eng_words = new Set();
var hin_words = new Set();

var eng_roots = new Set();
var hin_roots = new Set();


function eng_gen() {
    var condition1 = function () {
        len_eng = corpus_eng.length;
        for (i = 0; i < len_eng; i++) {
            var temp = corpus_eng[i].split("\t");
            eng_ans.push(temp);
            eng_words.add(eng_ans[i][0]);
            eng_roots.add(eng_ans[i][1]);
        }
    }
    $.when($.get("features_english.txt", function (data_eng) { corpus_eng = data_eng.split("\n") })).then(condition1);
}

function hin_gen() {
    var condition2 = function () {
        len_hin = corpus_hin.length;
        // console.log(len_hin)
        for (i = 0; i < len_hin; i++) {
            var temp = corpus_hin[i].split("\t");
            hin_ans.push(temp);
            hin_words.add(hin_ans[i][0]);
            hin_roots.add(hin_ans[i][1]);
        }
    }
    $.when($.get("features_hindi.txt", function (data_hin) { corpus_hin = data_hin.split("\n") })).then(condition2);
}

eng_gen();
hin_gen();

function display() {
    lang = document.getElementById("selectedEngorHin").value;
    root = document.getElementById("root").value;

    if (lang == "") {
        $('#input_table').hide();
        $('#dropdown2').hide();
        $('#instruction').hide();
        document.getElementById("check").style.visibility = 'hidden';
        $('#verdict').hide();
        $('#ans_div').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        alert("Select Language");
    }

    if (lang == "English") {
        $('#dropdown2').show();
        $('#instruction').show();
        $('#input_table').show();
        $('#selectword').empty();
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        document.getElementById("check").style.visibility = 'visible';
        $('#ans_div').hide();
        $('#verdict').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        $('#root').empty();
        let temp = Array.from(eng_roots);
        var root_content = document.getElementById("root");
        root_content[root_content.length] = new Option("na", "na");
        for (i = 0; i < temp.length; i++) {
            root_content[root_content.length] = new Option(temp[i], temp[i]);
        }

    }

    if (lang == "Hindi") {
        $('#dropdown2').show();
        $('#instruction').show();
        $('#input_table').show();
        $('#selectword').empty();
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        document.getElementById("check").style.visibility = 'visible';
        $('#verdict').hide();
        $('#ans_div').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        $('#root').empty();
        let temp = Array.from(hin_roots);
        var root_content = document.getElementById("root");
        root_content[root_content.length] = new Option("na", "na");
        for (i = 0; i < temp.length; i++) {
            root_content[root_content.length] = new Option(temp[i], temp[i]);
        }


    }
}

function choose() {
    root = document.getElementById("root").value;

    if (lang == "English") {
        $('#selectword').empty();
        let temp1 = Array.from(eng_words);
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        for (i = 0; i < temp1.length; i++) {
            if (temp1[i][0] == root[0]) {
                dropdown2_content[dropdown2_content.length] = new Option(temp1[i], temp1[i]);
            }
        }
        dropdown2_content[dropdown2_content.length] = new Option("NONE", "null");
    }

    if (lang == "Hindi") {
        $('#selectword').empty();
        let temp1 = Array.from(hin_words);
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        for (i = 0; i < temp1.length; i++) {
            if (temp1[i][0] == root[0]) {
                dropdown2_content[dropdown2_content.length] = new Option(temp1[i], temp1[i]);
            }
        }
        dropdown2_content[dropdown2_content.length] = new Option("NONE", "null");
    }

}


function word_select() {
    selected_word = document.getElementById("selectword").value;
    if (selected_word == "") {
        alert("Select Word");
    }
}
// Function is called when the Check button is clicked, checks the input from the dropdowns and displays the verdict.
function check() {

    selected_word = document.getElementById("selectword").value;

    if (selected_word == "") {
        alert("Select Word");
    }
    else {
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        buffer = [];
        buffer.push("");
        buffer.push(document.getElementById("root").value);
        buffer.push(document.getElementById("category").value);
        buffer.push(document.getElementById("gender").value);
        buffer.push(document.getElementById("number").value);
        buffer.push(document.getElementById("case").value);
        buffer.push(document.getElementById("person").value);

        count = 0;

        if (lang == "English") {
            buffer.push("en");
            buffer.push("roman");
            buffer.push(document.getElementById("tense").value);

            for (i = 0; i < eng_ans.length; i++) {
                count = 0;
                for (j = 1; j < eng_ans[i].length; j++) {
                    if (eng_ans[i][j] == buffer[j]) {
                        count++;
                    }
                }
                if (count == 9) {
                    buffer[0] = eng_ans[i][0];
                    break;
                }
            }
        }
    }

    if (lang == "Hindi") {
        buffer.push("hi");
        buffer.push("devanagiri");
        buffer.push(document.getElementById("tense").value);

        for (i = 0; i < hin_ans.length; i++) {
            count = 0;
            for (j = 1; j < hin_ans[i].length; j++) {
                if (hin_ans[i][j] == buffer[j]) {
                    count++;
                }
            }
            if (count == 9) {
                buffer[0] = hin_ans[i][0];
                break;
            }
        }
    }

    // console.log(selected_word);
    // console.log(buffer);
    // console.log(count);

    // check array stores ,[ word, root(1), category(2), gender(3), number(4), case(5), person(6), lang, script, tense(9)] 

    if (count == 9) {
        // right
        if (selected_word == buffer[0]) {
            document.getElementById("verdict").innerHTML = "Right Ans!!!"
            $('#ans_div').hide();
        }
        else {
            document.getElementById("verdict").innerHTML = "Wrong Ans!!!"
            $('#show_ans').show();
            $('#ans_div').show();
        }
    }
    else {
        // wrong;
        if (selected_word == "null") {
            document.getElementById("verdict").innerHTML = "Right Ans!!!"
            $('#ans_div').hide();
        }
        else {
            document.getElementById("verdict").innerHTML = "Wrong Ans!!!"
            $('#show_ans').show();
            $('#ans_div').show();
        }
    }
    $('#verdict').show();
}

function reset() {
    document.getElementById("ans_button").innerHTML = "Get Answer";
    $('#verdict').hide();
    $('#ans_div').hide();
    $('#answers').hide();


}

function show_answers() {

    action = document.getElementById("ans_button").innerHTML;

    if (action == "Get Answer") {
        document.getElementById("ans_button").innerHTML = "Hide Ans";
        if (buffer[0] == "") {
            document.getElementById("answers").innerHTML = "<b>Answer : </b> Word with such features does not exist"
        }
        else {
            document.getElementById("answers").innerHTML = "<b>Answer : </b>" + buffer[0];
        }
        $('#answers').show();
    }
    else {
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
    }

}


