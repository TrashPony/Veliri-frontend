let msgCalc = {};

setInterval(function () {
  if (Object.keys(msgCalc).length !== 0) {

    let allCount = 0;
    let allSize = 0;

    for (let i in msgCalc) {

      console.log(i, "count: ", msgCalc[i].count, ", size: ", Math.round(msgCalc[i].size / 1024), 'kb');

      allCount += msgCalc[i].count;
      allSize += msgCalc[i].size;
    }

    console.log("all - count: ", allCount, ", size: ", Math.round(allSize / 1024), 'kb');
    console.log("-----------");
    console.log();

    msgCalc = {}
  }
}, 1000);

function logMsg(event, data) {
  return
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
  if (!msgCalc.hasOwnProperty(event)) msgCalc[event] = {count: 0, size: 0};
  msgCalc[event].count++;
  msgCalc[event].size += blob.size;
}

export {logMsg}
