$("form").on("submit", function(event) {
  var form      = $(event.target),
      appId     = form.find("#appId")[0].value;
      userEmail = form.find("#userEmail")[0].value,
      userPass  = form.find("#userPassword")[0].value;
  
  $('#myModal').modal('toggle');

  Parse.initialize(appId);
  Parse.serverURL = 'https://appdev.newyorker.de/newyorkerapitest';

  loginUserToParseServer(userEmail, userPass);

  event.preventDefault();
});

function loginUserToParseServer(email, password) {
  var login = Parse.User.logIn(email, password);

  Parse.Promise.when(login).then(
    function() {
      $("#loginBtn").hide();
      handleCustomerSexRatio();
    },
    function(error) {
      console.log(error[0].message);
    }
  );
}

function handleCustomerSexRatio() {
  var CustomerProfile = Parse.Object.extend("CustomerProfile"),
      query_f         = new Parse.Query(CustomerProfile),
      query_m         = new Parse.Query(CustomerProfile),
      query_na        = new Parse.Query(CustomerProfile),
      queriesCount;

  query_m.equalTo("sex", "MALE");
  query_f.equalTo("sex", "FEMALE");
  query_na.notEqualTo("sex", "MALE").notEqualTo("sex", "FEMALE");

  queriesCount = [query_f.count(), query_m.count(), query_na.count()];

  Parse.Promise.when(queriesCount).then(drawGraph);
}

function drawGraph(female, male, na) {
  var myPieChart = new Chart($("#myChart"), {
        type: 'pie',
        data: {
                labels: [ "Female", "Male", "N/A" ],
                datasets: [{
                  data: [female, male, na],
                  backgroundColor: [ "#FF6384", "#36A2EB", "#EEEEEE" ],
                  hoverBackgroundColor: [ "#FF6384", "#36A2EB", "#EEEEEE" ]
                }]
              },
        options: { responsive: true }
      });
}
