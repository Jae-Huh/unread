
const HTMLParser = require('node-html-parser')

const testData = `<img alt="" src="https://cdn.vox-cdn.com/thumbor/z1am8VMN0xsiABUsRklY0vGh7G0=/306x0:3546x2160/1310x873/cdn.vox-cdn.com/uploads/chorus_image/image/63968876/Spider_Man_PS4_Preview_Jump.5.jpg" /> <p id="n7kwHC">Sony may be <a href="https://www.theverge.com/2018/11/15/18097441/sony-playstation-skipping-e3-2019-keynote-booth">skipping this year’s E3 expo in Los Angeles</a>, but it does have some good news to satiate fans in the form of its <a href="https://blog.us.playstation.com/2019/06/06/days-of-play-deals-hit-playstation-store/">annual Days of Play sale</a>. Starting today and lasting 11 days until Monday, June 17th, the sale has some spectacular deals across both Sony’s exclusive lineup of best-selling hits and multiplatform games. </p> <p id="beowdV">This doesn’t just include base games. Sony has expansions, deluxe digital versions, and even virtual reality titles on the list. The full list includes over 250 titles and add-ons, and Sony is also offering $20 off an annual PS Plus membership (normally $59.99) and $30 off an annual PS Now membership (normally $99.99). </p> <aside id="cglqKf"><div data-anthem-component="readmore" data-anthem-component-data='{"stories":[{"title":"The 15 best video games of 2018","url":"https://www.theverge.com/2018/12/17/18137458/best-video-games-2018-xbox-ps4-switch"}]}'></div></aside><p id="jBqlEB">The company is also introducing a State of Play edition PS4 Slim console (1TB) for $299.99,...</p> <p> <a href="https://www.theverge.com/2019/6/7/18656970/sony-playstation-4-days-of-play-deals-discounts-video-game-sales">Continue reading&hellip;</a> </p>`

const rootDOM = HTMLParser.parse(testData)
const snippetWithLinks = rootDOM.querySelectorAll("p")[0].innerHTML.toString()
const linkRegex = /<(\/?)(a)[^>]{0,}>/g
const snippet = snippetWithLinks.replace(linkRegex, "")

console.log(snippet)