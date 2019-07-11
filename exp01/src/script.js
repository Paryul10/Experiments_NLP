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

// these 2 helper functions generate data from the text file.
function eng_gen() {
    var condition1 = function () {
        len_eng = corpus_eng.length;
        // console.log(len_eng)
        for (i = 0; i < len_eng; i++) {
            var temp = corpus_eng[i].split("\t");
            eng_ans.push(temp);
            eng_words.add(eng_ans[i][0]);
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
        }
    }
    $.when($.get("features_hindi.txt", function (data_hin) { corpus_hin = data_hin.split("\n") })).then(condition2);
}

eng_gen();
hin_gen();

// language selection and  display of dropdown
function display() {
    lang = document.getElementById("selectedEngorHin").value;

    if (lang == "") {
        $('#dropdown2').hide();
        $('#input_table').hide();
        $('#instruction').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        alert("Select Language");
    }

    if (lang == "English") {
        $('#dropdown2').show();
        $('#input_table').hide();
        $('#instruction').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        $('#selectword').empty();
        let temp = Array.from(eng_words);
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        for (i = 0; i < temp.length; i++) {
            dropdown2_content[dropdown2_content.length] = new Option(temp[i], temp[i]);
        }
    }

    if (lang == "Hindi") {
        $('#dropdown2').show();
        $('#input_table').hide();
        $('#instruction').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        $('#selectword').empty();
        let temp = Array.from(hin_words);
        var dropdown2_content = document.getElementById("selectword");
        dropdown2_content[dropdown2_content.length] = new Option("---Select Word---", "");
        for (i = 0; i < temp.length; i++) {
            dropdown2_content[dropdown2_content.length] = new Option(temp[i], temp[i]);
        }
    }
}

//chose the combination fro dropdown
function choose() {
    selected_word = document.getElementById("selectword").value;
    if (selected_word == "") {
        $('#input_table').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        alert("Select Word");
    }
    else {
        $('#instruction').show();
        $('#input_table').show();

        $('#show_ans').hide();
        $('#word_ans').hide();
        $('#root_ans').hide();
        $('#category_ans').hide();
        $('#gender_ans').hide();
        $('#number_ans').hide();
        $('#person_ans').hide();
        $('#case_ans').hide();
        $('#tense_ans').hide();

        $('#verdict').hide();
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
        document.getElementById("word").innerHTML = selected_word;
        $('#root').empty();
        var root_content = document.getElementById("root");
        var val = document.getElementById("word").innerHTML;
        // console.log(typeof(val));
        root_content[root_content.length] = new Option("na", "");
        // lang = document.getElementById("selectedEngorHin").value;
        let temp = [];
        if (lang == "English") {
            temp = Array.from(eng_words);
        }
        if (lang == "Hindi") {
            temp = Array.from(hin_words);
        }
        for (i = 0; i < temp.length; i++) {
            if (temp[i][0] == val[0]) {
                root_content[root_content.length] = new Option(temp[i], temp[i]);
            }
        }
    }
}

// Function is called when the Check button is clicked, checks the input from the dropdowns and displays the verdict.
function check() {
    $('#answers').hide();
    document.getElementById("ans_button").innerHTML = "Get Answer";
    buffer = [];
    buffer.push(document.getElementById("word").innerHTML);
    buffer.push(document.getElementById("root").value);
    buffer.push(document.getElementById("category").value);
    buffer.push(document.getElementById("gender").value);
    buffer.push(document.getElementById("number").value);
    buffer.push(document.getElementById("case").value);
    buffer.push(document.getElementById("person").value);

    check_array = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

    max_overlap = 0;

    if (lang == "English") {
        buffer.push("en");
        buffer.push("roman");
        buffer.push(document.getElementById("tense").value);

        for (i = 0; i < eng_ans.length; i++) {
            if (eng_ans[i][0] == buffer[0]) {
                check_array[0] = 1;
                for (j = 1; j < check_array.length; j++) {
                    if (eng_ans[i][j] == buffer[j]) {
                        check_array[j] = 1;
                    }
                }

            }

        }
    }

    if (lang == "Hindi") {
        buffer.push("hi");
        buffer.push("devanagiri");
        buffer.push(document.getElementById("tense").value);

        for (i = 0; i < hin_ans.length; i++) {
            if (hin_ans[i][0] == buffer[0]) {
                check_array[0] = 1;
                for (j = 1; j < check_array.length; j++) {
                    if (hin_ans[i][j] == buffer[j]) {
                        check_array[j] = 1;
                    }
                }

            }

        }

    }

    console.log(check_array);
    for (i = 0; i < check_array.length; i++) {
        if (check_array[i] == 1) {
            max_overlap++;
        }
    }

    console.log(max_overlap);

    // check array stores ,[ word, root(1), category(2), gender(3), number(4), case(5), person(6), lang, script, tense(9)] 

    if (check_array[1] == 1) {
        document.getElementById("root_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("root_ans").innerHTML = "Wrong"
    }

    if (check_array[2] == 1) {
        document.getElementById("category_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("category_ans").innerHTML = "Wrong"
    }

    if (check_array[3] == 1) {
        document.getElementById("gender_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("gender_ans").innerHTML = "Wrong"
    }

    if (check_array[4] == 1) {
        document.getElementById("number_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("number_ans").innerHTML = "Wrong"
    }

    if (check_array[5] == 1) {
        document.getElementById("case_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("case_ans").innerHTML = "Wrong"
    }

    if (check_array[6] == 1) {
        document.getElementById("person_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("person_ans").innerHTML = "Wrong"
    }

    if (check_array[9] == 1) {
        document.getElementById("tense_ans").innerHTML = "Correct"
    }
    else {
        document.getElementById("tense_ans").innerHTML = "Wrong"
    }

    $('#word_ans').show();
    $('#root_ans').show();
    $('#category_ans').show();
    $('#gender_ans').show();
    $('#number_ans').show();
    $('#person_ans').show();
    $('#case_ans').show();
    $('#tense_ans').show();

    if (max_overlap == 10) {
        // right
        document.getElementById("verdict").innerHTML = "Right Ans!!!"
        // document.getElementById("ans_but")
        $('#ans_button').hide();

    }
    else {
        // wrong;
        document.getElementById("verdict").innerHTML = "Wrong Ans!!!"
        $('#show_ans').show();
        $('#ans_button').show();
    }
    $('#verdict').show();
}

function show_answers() {

    action = document.getElementById("ans_button").innerHTML;

    if (action == "Get Answer") {
        document.getElementById("ans_button").innerHTML = "Hide Ans";
        selected_word = document.getElementById("word").innerHTML;
        console.log(selected_word);
        ans_arr = [];
        if (lang == "English") {
            for (i = 0; i < eng_ans.length; i++) {
                if (eng_ans[i][0] == selected_word) {
                    ans_arr.push(eng_ans[i]);
                }
            }
        }

        if (lang == "Hindi") {
            for (i = 0; i < hin_ans.length; i++) {
                if (hin_ans[i][0] == selected_word) {
                    ans_arr.push(hin_ans[i]);
                }
            }
        }

        table = '';
        rows = ans_arr.length;

        table += '<tr>'
        table += '<td style="color:brown">' + "WORD" + '</td>';
        table += '<td style="color:brown">' + "ROOT" + '</td>';
        table += '<td style="color:brown">' + "CATEGORY" + '</td>';
        table += '<td style="color:brown">' + "GENDER" + '</td>';
        table += '<td style="color:brown">' + "NUMBER" + '</td>';
        table += '<td style="color:brown">' + "CASE" + '</td>';
        table += '<td style="color:brown">' + "PERSON" + '</td>';
        table += '<td style="color:brown">' + "TENSE" + '</td>';


        table += '</tr>'


        for (i = 0; i < rows; i++) {
            table += '<tr>';
            for (j = 0; j < ans_arr[i].length; j++) {
                if (j == 0) {
                    table += '<td style="color:red">' + ans_arr[i][j] + '</td>';
                }
                if (j != 7 && j != 8 && j != 0) {
                    table += '<td>' + ans_arr[i][j] + '</td>';
                }
            }
            table += '</tr>';
        }


        document.getElementById("answers").innerHTML = table;
        $('#answers').show();
    }
    else {
        $('#answers').hide();
        document.getElementById("ans_button").innerHTML = "Get Answer";
    }

}


