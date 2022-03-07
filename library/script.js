function generate_population() {
    a = lower_bound;
    b = upper_bound;
    size = [$("#population_size").val(), $("#board_size").val()];
    let generated_population = [];
    for (let i = 0; i < size[0]; i++) {
        generated_population.push([]);
        for (let j = 0; j < size[1]; j++)
            generated_population[i].push(Math.random() * b + a);
    }
    population = generated_population;
    $("#population").val(JSON.stringify(population, undefined, 4));
    return generated_population;
}
/** @param {Number} a_index */
function randomOtherIndividual(a_index) {
    let b_index = -1;
    while (b_index == -1 || b_index == a_index)
        b_index = Math.floor(Math.random() * population.length);
    return b_index;
}
/** @param {Number} a_index */
function mutualism(a_index) {
    let b_index = randomOtherIndividual(a_index);
    let a = population[a_index];
    let b = population[b_index];
    let bf_a = Math.floor(Math.random() * 2) + 1;
    let bf_b = Math.floor(Math.random() * 2) + 1;
    let mutual_vector = nj.divide(nj.add(a, b).selection.data, 2).selection
        .data;
    let new_a = nj.add(
        a,
        nj.multiply(
            nj.subtract(best, nj.multiply(mutual_vector, bf_a).selection.data)
                .selection.data,
            Math.random()
        ).selection.data
    ).selection.data;
    let new_b = nj.add(
        b,
        nj.multiply(
            nj.subtract(best, nj.multiply(mutual_vector, bf_b).selection.data)
                .selection.data,
            Math.random()
        ).selection.data
    ).selection.data;
    if (fitness_func(new_a) > fitness_func(a)) population[a_index] = new_a;
    if (fitness_func(new_b) > fitness_func(b)) population[b_index] = new_b;
}
/** @param {Number} a_index */
function commensalism(a_index) {
    let b_index = randomOtherIndividual(a_index);
    let a = population[a_index];
    let b = population[b_index];
    let new_a = nj.add(
        a,
        nj.multiply(nj.subtract(best, b).selection.data, Math.random() * 2 - 1)
            .selection.data
    ).selection.data;
    if (fitness_func(new_a) > fitness_func(a)) population[a_index] = new_a;
}
/** @param {Number} a_index */
function parasitism(a_index) {
    let b_index = randomOtherIndividual(a_index);
    let a = population[a_index];
    let b = population[b_index];
    let parasite_vector = [...a];
    parasite_vector[Math.random() * parasite_vector.length] = Math.random();
    if (fitness_func(parasite_vector) > fitness_func(b))
        population[b_index] = parasite_vector;
}
/** @param {Array} v */
function fitness_func(v) {
    // fitness function
    // n - queen
    // index adalah column yang menentu column yg mana
    // nilai dari setiap index menandakan row yg mana diurut dari terkecil (row 1)
    //   0    1    2    3   --> column
    // [0.7, 0.4, 0.2, 0.9]
    //   3    2    1    4   --> row
    // ngebug jika ketemu elemen yang sama
    let order = [];
    let sorted_v = [...v].sort();
    for (let i = 0; i < sorted_v.length; i++) {
        index_found = sorted_v.indexOf(v[i]);
        sorted_v[index_found] = null;
        order.push(index_found);
    }

    let fitness = 0;
    for (let i = 0; i < board_size; i++) {
        for (let j = 0; j < board_size; j++) {
            // posisi yang sama
            if (i == j) continue;
            else {
                // diagonal yang sama
                let delta_row = Math.abs(order[j] - order[i]);
                let delta_col = Math.abs(j - i);

                // print(j,i,delta_row, delta_col)
                if (delta_row == delta_col) fitness -= 1;
            }
        }
    }
    // print(v, fitness)
    return fitness;
}
/** @param {Array} v */
function get_board(v) {
    let order = [];
    let sorted_v = [...v].sort();
    for (let i = 0; i < sorted_v.length; i++) {
        index_found = sorted_v.indexOf(v[i]);
        sorted_v[index_found] = null;
        order.push(index_found);
    }
    let board = [];
    for (let i = 0; i < board_size; i++) {
        board.push([]);
        for (let j = 0; j < board_size; j++) {
            if (order[j] == i) board[i].push("Q");
            else board[i].push(" ");
        }
    }
    return board;
}

function get_best_organism() {
    temp = [...population];
    return temp.sort(function (a, b) {
        return fitness_func(b) - fitness_func(a);
    })[0];
}

function SOS() {
    // loop until max iteration
    let t_start = performance.now();
    let iteration = 0;
    for (let i = 0; i < max_iteration; i++) {
        // loop all population (organism)
        best = get_best_organism();
        // if found solution break
        if (fitness_func(best) == 0) break;
        for (let j = 0; j < population.length; j++) {
            mutualism(j);
            commensalism(j);
            parasitism(j);
        }
        iteration++;
    }
    best = get_best_organism();
    let t_end = performance.now();

    let time = t_end - t_start;
    $("#execution_time").text(
        `Stopping at iteration ${iteration}/${max_iteration}. The Algorithm took ${time} ms.`
    );

    console.table(get_board(best));
    console.log(fitness_func(best));
    return best;
}

function check_population_format() {
    try {
        let temp_population = JSON.parse($("#population").val());
        // check if each child have same length
        if (temp_population.length < 2)
            throw "Population size must be more than 1";
        if (temp_population[0].length < 1)
            throw "Each organism must have at least 1 value";

        for (let i = 0; i < temp_population.length; i++)
            if (temp_population[0].length != temp_population[i].length)
                throw "Each organism must have same size of value";

        return true;
    } catch (error) {
        alert(error);
        return false;
    }
}

function solve() {
    if (check_population_format()) {
        // initialize
        max_iteration = $("#max_iteration").val();
        population = JSON.parse($("#population").val());
        population_size = population.length;
        board_size = population[0].length;

        // sos
        best = SOS();

        // show best organism
        $("#best").text("");
        $("#best").append(JSON.stringify(best, undefined, 4));

        // show its fitness
        $("#fitness").text(fitness_func(best));

        draw_board(best);
    }
}
/** @param {Array} v */
function draw_board(v) {
    let board = get_board(v);
    let chess_board_HTML = $("#chess_board");
    chess_board_HTML.html("");
    chess_board_HTML.attr("style", "padding: 10px; border: 5px solid #251300;");
    let ctr = 0;
    for (var i = 0; i < board_size; i++) {
        chess_board_HTML.append(`<div style="display:flex"></div>`);
        for (var j = 0; j < board_size; j++) {
            tile_size = (window.screen.width * 0.35) / board_size;
            chess_board_HTML.children()[
                i
            ].innerHTML += `<div id="tile-${i}-${j}" class="tile smoothfade hover" style="width:${tile_size}px; height:${tile_size}px;" onclick="click_tile(${i},${j})"></div>`;
            if ((i % 2 == 0 && j % 2 != 0) || (i % 2 != 0 && j % 2 == 0))
                $(".tile").eq(ctr).addClass("black");
            else $(".tile").eq(ctr).addClass("white");

            if (board[i][j] == "Q") {
                $(".tile")
                    .eq(ctr)
                    .append(`<img class='queen' src='image/queen-white.png'>`);
            }
            ctr++;
        }
    }
}
/**
 * @param {Number} row
 * @param {Number} col
 */
function click_tile(row, col) {
    for (let i = 0; i < board_size; i++)
        for (let j = 0; j < board_size; j++)
            $(`#tile-${i}-${j}`).removeClass("legal");
    board = get_board(best);
    if (board[row][col] == "Q") {
        for (let i = 0; i < board_size; i++)
            for (let j = 0; j < board_size; j++)
                if (
                    i == row ||
                    j == col ||
                    Math.abs(j - col) == Math.abs(i - row)
                )
                    $(`#tile-${i}-${j}`).addClass("legal");
    }
}

//  Global Variable
/** @type {Number} */
var max_iteration = 100,
    board_size = 4,
    upper_bound = 1,
    lower_bound = 0,
    population_size = 20;
/** @type {Array} */
var best = [],
    population = [];

$(() => {
    population = [
        [
            0.43005813566668993,
            0.8667016872896585,
            0.10435148016948248,
            0.5143438898858725,
            0.2313370267554986,
            0.7324322476417786,
            0.21610888462396605,
            0.8190098244097164,
        ],
        [
            0.9914631970035732,
            0.7480411022072648,
            0.0273330529753002,
            0.5347618094650175,
            0.3930251498320989,
            0.48179395086073895,
            0.3221837643964107,
            0.9776046068439297,
        ],
        [
            0.5895600611471918,
            0.5578710895382983,
            0.8813677996451363,
            0.30951513364135463,
            0.9000569921759511,
            0.0991536007281093,
            0.8452757377701254,
            0.16940187701988152,
        ],
        [
            0.09761857044196631,
            0.6138141967869097,
            0.3963407132136858,
            0.5542121481646252,
            0.435357276302357,
            0.3185855984300603,
            0.12573279384623404,
            0.21974555123565476,
        ],
        [
            0.6879081318248537,
            0.6801945150273208,
            0.7547275866642846,
            0.39389134001031567,
            0.8016102802171585,
            0.6757783913631104,
            0.1665314787105281,
            0.8448248347707263,
        ],
        [
            0.4336131354330228,
            0.6357368333133881,
            0.5255509965136826,
            0.15986681582625262,
            0.7581124810757658,
            0.554791020680776,
            0.8087382927119451,
            0.15813844346180628,
        ],
        [
            0.2787783891777531,
            0.278647083993933,
            0.06006742241876206,
            0.43594338357097295,
            0.9023279575770802,
            0.6470018833763729,
            0.706932063982572,
            0.8287445034075398,
        ],
        [
            0.17717436586572877,
            0.5023569436341355,
            0.3979652859859557,
            0.025061117051208726,
            0.0030515656338203634,
            0.51537293440722,
            0.10657043400162025,
            0.45655535733348307,
        ],
        [
            0.3720267045244956,
            0.14380920634232797,
            0.8082693466113462,
            0.09518420063178978,
            0.1383963776076642,
            0.8600431564770497,
            0.729020151264814,
            0.03247147000165951,
        ],
        [
            0.57825078394941,
            0.8203506834597363,
            0.11264721810027334,
            0.38150938576663473,
            0.25523319661831456,
            0.42431048135747895,
            0.46885732831734606,
            0.24355604255321017,
        ],
        [
            0.20608907314609737,
            0.45882350203192623,
            0.9845556904270127,
            0.6970004118347322,
            0.643940200440154,
            0.16377058595214078,
            0.3335867200697509,
            0.701298470085842,
        ],
        [
            0.4644154981036186,
            0.014873001094101612,
            0.46853518619274026,
            0.8120575825967149,
            0.4955395193703449,
            0.4601614200325339,
            0.1633644265908445,
            0.5994250501619707,
        ],
        [
            0.12546999042250628,
            0.6863440381589798,
            0.0436776301444437,
            0.8119855426563285,
            0.17126678636211268,
            0.5267134172912176,
            0.11074312838795808,
            0.017759158284276877,
        ],
        [
            0.5213000316317891,
            0.4445595667763287,
            0.8956569516830137,
            0.7590692447656058,
            0.7550626873567194,
            0.7145069492698446,
            0.8386619841050027,
            0.26521529431640856,
        ],
        [
            0.8250626653328879,
            0.3642152314697926,
            0.3877278479196622,
            0.22874248258055307,
            0.04556361697698885,
            0.03881159089228192,
            0.2891859152834355,
            0.20321529725757093,
        ],
        [
            0.719503852649076,
            0.18045075332121074,
            0.10713118940448996,
            0.9573380650453447,
            0.14232394569222628,
            0.258264133427911,
            0.6179712974728802,
            0.3288252987027813,
        ],
        [
            0.9565649325953522,
            0.8160059974343441,
            0.4374175425586928,
            0.28430699922196845,
            0.3504944436878932,
            0.4947200342278917,
            0.6014558965815182,
            0.3439052995939087,
        ],
        [
            0.20793139412435124,
            0.851740803211736,
            0.5275326260548778,
            0.07451478302487757,
            0.018164821306068113,
            0.7277518128847704,
            0.16317720300530447,
            0.10305947527075898,
        ],
        [
            0.2215727619459924,
            0.5480602600570792,
            0.8522781649879774,
            0.9625842124379158,
            0.044481414905432226,
            0.0152781004470941,
            0.9895777003076573,
            0.8934856029176341,
        ],
        [
            0.30425135234855993,
            0.1424376429905434,
            0.5571778897258406,
            0.1941380032343194,
            0.9040850812497452,
            0.04758606615345262,
            0.47770804962761937,
            0.619647492080776,
        ],
        [
            0.11671447429882642,
            0.6519332107356048,
            0.24814444990601525,
            0.8563964675995341,
            0.17759857038210525,
            0.7537458197890765,
            0.2745771015920322,
            0.8480905739777909,
        ],
        [
            0.23737903105627245,
            0.028536425246690866,
            0.15262247463521894,
            0.13334453222094456,
            0.26035908217906556,
            0.5858612011633482,
            0.017843106669128028,
            0.23579259832159227,
        ],
        [
            0.9536094427205131,
            0.8872666560943439,
            0.33191624459171654,
            0.2892456044505338,
            0.10096621847226639,
            0.718985667387271,
            0.34971272587615165,
            0.9057751923849577,
        ],
        [
            0.2246660626948367,
            0.6736437613450394,
            0.15909930937536565,
            0.5167620184431025,
            0.9474569999090618,
            0.3257126983514642,
            0.5425026617236188,
            0.8934933232286149,
        ],
        [
            0.20867185070754268,
            0.13831114150580803,
            0.8759037210710239,
            0.7388975017154378,
            0.054830113007803494,
            0.8496469755829501,
            0.4178592848831426,
            0.4988236188803197,
        ],
        [
            0.7708087936508148,
            0.6492799654774135,
            0.079519923426836,
            0.6284399118984947,
            0.6896190662821531,
            0.14023759381419376,
            0.9847559255809062,
            0.6189805574459226,
        ],
        [
            0.05806939894847263,
            0.198505358059885,
            0.5058546948479468,
            0.7140420700409447,
            0.491729770945057,
            0.07052491286043949,
            0.17555826994836976,
            0.9254386910506707,
        ],
        [
            0.5002743303947836,
            0.02851157435504237,
            0.1865751336414594,
            0.541438774242611,
            0.1940811374075202,
            0.4581107862506171,
            0.6862928771173744,
            0.5317008881461172,
        ],
        [
            0.05913366775734241,
            0.6581187468342846,
            0.20242209198595607,
            0.14530178839349484,
            0.3545968887142954,
            0.6945862537922634,
            0.6945699876407052,
            0.4288403307278643,
        ],
        [
            0.4395219890934723,
            0.8356230001219604,
            0.1537910114010066,
            0.6916784363058159,
            0.6412526603788173,
            0.06478476788699328,
            0.5471779372003187,
            0.47075711377989515,
        ],
    ];
    $("#population").val(JSON.stringify(population, undefined, 4));
});
