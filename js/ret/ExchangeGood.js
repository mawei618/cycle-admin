$(function () {
    var returnCode = getQueryString("returnCode");
    if (returnCode) {
        $("input[name='returnCode']", ".bd").val(returnCode);
    }

    var orderCode = getQueryString("orderCode");
    if (orderCode) {
        $("input[name='orderCode']", ".bd").val(orderCode);
    }

    //var startDate = getQueryString("startDate");
    //if (startDate) {
    //    $("input[name='startDate']", ".bd").val(startDate);
    //}

    //var comStartHour = getQueryString("comStartHour");
    //if (comStartHour) {
    //    $("select[name='comStartHour']", ".bd").val(comStartHour);
    //}

    //var startMinute = getQueryString("startMinute");
    //if (startMinute) {
    //    $("input[name='startMinute']", ".bd").val(startMinute);
    //}

    //var endDate = getQueryString("endDate");
    //if (endDate) {
    //    $("input[name='endDate']", ".bd").val(endDate);
    //}

    //var comEndHour = getQueryString("comEndHour");
    //if (comEndHour) {
    //    $("select[name='comEndHour']", ".bd").val(comEndHour);
    //}

    //var endMinute = getQueryString("endMinute");
    //if (endMinute) {
    //    $("input[name='endMinute']", ".bd").val(endMinute);
    //}
    var memberName = getQueryString2("memberName");
    if (memberName) {
        $("input[name='memberName']", ".bd").val(memberName);
    }

    var reviewType = getQueryString("reviewType");
    if (reviewType) {
        $("select[name='reviewType']", ".bd").val(reviewType);
    }
});