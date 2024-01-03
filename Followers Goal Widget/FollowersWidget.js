
//Global state object
let state = {
    "goal": {
        "value": 0,
        "label": ""
    }
};

let rewards = [];
let runEffect = 'yes';
let autoUpdate = 'yes';
let autoUpdateValue = 10;

//runs code on widget load
window.addEventListener('onWidgetLoad', function (obj) {
    let data = obj.detail.session.data;
    let fieldData = obj.detail.fieldData;

    rewards = fieldData.goal_reward.split(",");
    const random = Math.floor(Math.random() * rewards.length);
    state.goal.label = rewards[random];

    runEffect = fieldData.highlightEffect;
    autoUpdate = fieldData.goal_auto_update;
    state.goal.value = fieldData.goal_value;
    autoUpdateValue = parseInt(fieldData.goal_update_value);

    updateGoal(data["follower-total"]["count"]);
});

// update goal
function updateGoal(followerCount, isForced = false) {
    $('.goal').text(state.goal.value);
    $('.reward').text(state.goal.label);

    progress(followerCount, isForced);
}

window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener === "follower-latest") {
        progress(parseInt($('.current').text()) + 1);
    }
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

        if (autoUpdate === 'yes') {
            state.goal.value += autoUpdateValue;

            const random = Math.floor(Math.random() * rewards.length);
            state.goal.label = rewards[random];

            setTimeout(updateGoal, 120000, count+1, true);
        }

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