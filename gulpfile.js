const { src, dest, series } = require('gulp');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

const handlebars = require('gulp-compile-handlebars');
const htmlmin = require('gulp-htmlmin');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const csvparse = require('csv-parse/lib/sync');
const message_csv_file = 'src/messages.csv';
const fs = require('fs').promises;

const countries = require("i18n-iso-countries");

const imagemin = require('gulp-imagemin');

function minifycss() {
    return src('src/*.css')
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest('dist'));
}

const postageOverrides = {
    /* note: canada uses a P in a maple leaf and we have to handle this in the hbs file. */
    us: "$1.20",
    jp: "84",
    ar: "$65",
    br: "R$2,05",
    cn: "1.20",
    de: "100",
    fr: "€1.30",
    gb: "£4.20",
    hk: "$5",
    id: "5000",
    in: "500",
    it: "[B]",
    kr: "840",
    mx: "$15.00",
    my: "80sen",
    ph: "P100",
    ru: "56P",
    sg: "$1.30",
    tw: "15",
    vn: "15000d",
}

async function build_html() {
    let message_data = []
    let message_table = Object.create(null);
    let content = await fs.readFile(message_csv_file);
    let records = csvparse(content, { from_line: 2 });

    records.map(
        record => {
            const timestamp = record[0];
            const discordmatch = record[1].match(/.*#[0-9_)]*/g);
            const twittermatch = record[1].match(/@.*/g);
            let twitter = twittermatch ? twittermatch[0].trim() : "";
            const nickname = record[2].trim();
            const country = record[3].replace("-"," ");
            const message = record[5];
            const artwork_url = record[6];
            const message_jp = record[8];

            let country_code = '';
            let country_name = '';
            let country_name_stamp = '';
            let country_postage = '2021'; // worst case we just write the year instead of postage amt.

            if (country) {
                search_country_code = countries.getAlpha2Code(country, 'en');
                if (search_country_code) {
                    country_code = search_country_code.toLowerCase();
                    country_name = countries.getName(search_country_code, "en");
                    country_name_stamp = countries.getName(search_country_code, "ja", {select: "alias"});
                    country_postage = postageOverrides[country_code] || country_postage;
                    if (country_name_stamp === "アメリカ合衆国") country_name_stamp = "アメリカ";
                    if (country_name_stamp === "ロシア連邦") country_name_stamp = "ロシア";
                }
            }

            // https://stackoverflow.com/questions/15033196/using-javascript-to-check-whether-a-string-contains-japanese-characters-includi/15034560
            var jpCharacters = message.match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/);

            // if there isn't a match, then message is not in Japanese, pass this value to the handlebars file.
            // if there is no JP character and translation is not provided, then the message is in JP
            var isMsgInJP = !(jpCharacters === null) && record[6] === ""


            if (twitter.startsWith("@") || twitter.startsWith("＠")) {
                twitter = twitter.substring(1);
            }

            message_row = {
                timestamp: timestamp,
                username: nickname,
                twitter: twitter,
                country: country,
                country_name: country_name,
                country_name_stamp: country_name_stamp,
                country_code: country_code,
                country_postage: country_postage,
                message: message,
                artwork_url: artwork_url,
                isMsgInJP: isMsgInJP,
                message_jp: message_jp
            };
            if (discordmatch) {
                let discord = discordmatch ? discordmatch[0].trim() : "";
                message_table[discord] = message_row;
            } else if (twitter) {
                message_table[twitter] = message_row;
            } else {
                message_table[nickname] = message_row;
            }
        }
    );

    // Use to debug output for missing/duplicate entries
    //console.log(JSON.stringify(Object.keys(message_table)));

    for (var prop in message_table) {
        message_data.push(message_table[prop]);
    }

    let artbook_data = [
        {
            fullpage: "artbook/Forever9Nine.png",
            thumbnail: "artbook/thumbs/Forever9Nine.png",
            thumbnail_small: "artbook/thumbs_small/Forever9Nine_.png",
        },
        {
            fullpage: "artbook/Raze_Yukihana.png",
            thumbnail: "artbook/thumbs/Raze_Yukihana.png",
            thumbnail_small: "artbook/thumbs_small/Raze_Yukihana_.png",
        },
        {
            fullpage: "artbook/yukituki.png",
            thumbnail: "artbook/thumbs/yukituki.png",
            thumbnail_small: "artbook/thumbs_small/yukituki_.png",
        },
        {
            fullpage: "artbook/三世吾郎.png",
            thumbnail: "artbook/thumbs/三世吾郎.png",
            thumbnail_small: "artbook/thumbs_small/三世吾郎_.png",
        },
        {
            fullpage: "artbook/Kitsune_angel.png",
            thumbnail: "artbook/thumbs/Kitsune_angel.png",
            thumbnail_small: "artbook/thumbs_small/Kitsune_angel_.png",
        },
        {
            fullpage: "artbook/pipupapo.png",
            thumbnail: "artbook/thumbs/pipupapo.png",
            thumbnail_small: "artbook/thumbs_small/pipupapo_.png",
        },
        {
            fullpage: "artbook/Momo_Berry.jpg",
            thumbnail: "artbook/thumbs/Momo_Berry.jpg",
            thumbnail_small: "artbook/thumbs_small/Momo_Berry_.jpg",
        },
        {
            fullpage: "artbook/Troll_Logic.jpg",
            thumbnail: "artbook/thumbs/Troll_Logic.jpg",
            thumbnail_small: "artbook/thumbs_small/Troll_Logic_.jpg",
        }
    ]

    let template_data = {
        messages: message_data,
        artbook_data: artbook_data
    };
    let htmlminoptions = {
        minifyCSS: true,
        minifyJS: true,
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    }

    return src('src/index.handlebars')
        .pipe(handlebars(template_data, {helpers:{
            'eq': function(arg1, arg2, options) {
                return (arg1 == arg2) ? true : false;
            }
        }}))
        .pipe(htmlmin(htmlminoptions))
        .pipe(rename('index.html'))
        .pipe(dest('.'));
}

function minifyjs() {
    return src('src/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(dest('dist'))
}

function minifyimg() {
    return src('src/img/**/*')
        .pipe(imagemin([
            imagemin.optipng({
                interlaced: true
            })
        ]))
        .pipe(dest('dist/img'))
}

exports.build_full = series(minifycss, build_html, minifyjs, minifyimg);
exports.build = series(minifycss, build_html, minifyjs);
