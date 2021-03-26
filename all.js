let data = [];
axios.get('https://raw.githubusercontent.com/hexschool/js-traninging-week6API/main/data.json')
    .then(function (r) {
        data = r.data;
        init(data)
        renderList(data)
        renderGroupMost(data)
        renderGroupFast(data)
    })
    .catch(function (error) {
        console.log(error);
    })

//【初始化】

let groupData = [];
let groupObj = {};

function init(arr) {
    //all people
    arr.forEach(initRender)
    data.sort((a, b) => a.totalSecond - b.totalSecond)

    //group data 
    arr.forEach(toGroupObj)
    let groupNum = Object.keys(groupObj)
    groupNum.forEach(toGroupData)
    data.forEach(toDateparse)
}

//all people data init

function initRender(i) {
    if (i.practiceMinute < 10) { i.practiceMinute = '0' + i.practiceMinute.toString() };
    if (i.practiceSecond < 10) { i.practiceSecond = '0' + i.practiceSecond.toString() };
    if (i.message == undefined) { i.message = '' };
    if (!testurl(i.codepenUrl)) { i.codepenUrl = '' };
    if (!testurl(i.youtubeUrl)) { i.youtubeUrl = '' };
    i.totalSecond = totalSecond(i.practiceMinute, i.practiceSecond);
}

//計算總秒數
function totalSecond(min, sec) {
    min = parseInt(min);
    sec = parseInt(sec);
    return (min * 60) + sec
}

//URL驗證
function testurl(string) {
    var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
};

//group data init

function toGroupObj(item) {
    if (item.jsGroup !== '未分組') {
        groupObj[item.jsGroup] = groupObj[item.jsGroup] || [];
        groupObj[item.jsGroup].push(item)
    }
}

function toGroupData(item) {
    let obj = {};
    obj.jsGroup = item;
    obj.people = groupObj[item].length;
    obj.totalSecond = groupObj[item].reduce(((a, b) => a + b.totalSecond), 0)
    groupData.push(obj);
}

//【渲染上表格HTML】

//all people
const rankingData = document.querySelector('.js-rankingData')
function renderList(arr) {
    rankingData.innerHTML = '';
    arr.forEach(function (i, index) {
        let youtubeIcon = (i.youtubeUrl) ? 'fab fa-youtube' : ""
        let youtube = (i.youtubeUrl) ? i.youtubeUrl : ""
        let codepenIcon = (i.codepenUrl) ? 'fab fa-codepen' : ""
        let codepen = (i.codepenUrl) ? i.codepenUrl : ""

        rankingData.innerHTML += `<tr>
            <td>${index + 1}</td>
            <td>${i.slackName}</td>
            <td>${i.jsGroup}</td>
            <td class="youtube"><a class="${youtubeIcon}" href="${youtube}"></a></td>
            <td><a class="${codepenIcon}" href="${codepen}"></a></td>
            <td>${i.practiceMinute}:${i.practiceSecond}</td>
            <td>${i.timestamp}</td>
            <td>${i.message}</td>
            </tr>`;

    });
}

//group

//most success 
const groupMost = document.querySelector('.groupMost')
function renderGroupMost(arr) {
    groupData.sort((a, b) => b.people - a.people)
    groupMost.innerHTML = ''
    groupData.forEach(function (item, index) {
        if (index <= 9) {
            groupMost.innerHTML +=
                `<tr>
            <td>${index + 1}</td>
            <td>${item.jsGroup}組</td>
            <td>${item.people}人</td>
            </tr>`;
        }
    })
}

//most fast
const groupFast = document.querySelector('.groupFast')
function renderGroupFast(arr) {
    groupData.sort((a, b) => a.totalSecond - b.totalSecond)
    groupFast.innerHTML = ''
    groupData.forEach(function (item, index) {
        let averageSecond = (item.totalSecond / item.people).toFixed()
        if (index <= 9) {
            groupFast.innerHTML +=
                `<tr>
            <td>${index + 1}</td>
            <td>${item.jsGroup}組</td>
            <td>${averageSecond}秒</td>
            </tr>`;
        }
    })
}


//【篩選排序方式】
function toDateparse(item, index) {
    let arr = item.timestamp.split(' ')
    let date = new Date(arr[0] + ' ' + arr[2])
    if (arr[1] == '下午') { date.setHours(date.getHours() + 12) }
    item.dateParse = Date.parse(date)
}

const sortby = document.querySelector('#sortby')
sortby.addEventListener('change', function (e) {
    if (e.target.value == 'sortByTime') {
        data.sort((a, b) => a.dateParse - b.dateParse);
        renderList(data);
    } else if (e.target.value == 'sortBySecond') {
        data.sort((a, b) => a.totalSecond - b.totalSecond)
        renderList(data)
    }
})





