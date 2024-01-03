
//Global state object
let state = {
    "goal": {
        "value": 0,
        "label": ""
    }
};

let runEffect = 'yes';

//runs code on widget load
window.addEventListener('onWidgetLoad', function (obj) {
    let data = obj.detail.session.data;
    let fieldData = obj.detail.fieldData;

    state.goal.value = fieldData.goal_value;
    runEffect = fieldData.highlightEffect;

    updateGoal(data["cheer-total"]["amount"]);
});

// update goal
function updateGoal(followerCount, isForced = false) {
    progress(followerCount, isForced);
}

//runs code on event
window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener === "cheer-latest")
        progress(parseInt($('.current').text()) + parseInt(obj.detail.event.amount));
});

function progress(count, isForced = false) {
    const fill = document.querySelector("#fill");
    const fillOverlay = document.querySelector("#fill-overlay");
    const maxWidth = 100;

    if (!isForced)
        $('.current').text(count);
    else
        count--;

    let p = (count) / (state.goal.value) * maxWidth;

    if (count >= state.goal.value) {
        p = maxWidth;

        if (runEffect === 'yes') {
            fill.classList.add('highlighted');

            setTimeout(function () {
                fill.classList.remove('highlighted');
            }, 10000);
        }
    }
    else
        fill.classList.remove('highlighted');

    fillOverlay.style.setProperty('width', Math.round(p) + "%");
};