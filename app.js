var myFirebaseRef;
var chart;
/*var chartData = [
	['candidato1', 20],
	['candidato4', 13],
	['candidato2', 30],
	['candidato3', 40]
];*/
var chartData = [];
var flag = false;
var myTimer;

$(document).ready(function(){
	myFirebaseRef = new Firebase("https://appvotaciones.firebaseio.com");
	$('#candidato1, #candidato4, #candidato3, #candidato2').click(vote);
	$('#bar, #pie, #donut').click(tranformChart);
	$('#random').click(toogleRandom);
	requestData();
	addChart();

})

tranformChart = function(){
	chart.transform(this.id);
}

toogleRandom = function(){
	if(flag){
		clearInterval(myTimer);
		flag = false;
		return;
	}
	myTimer = setInterval(randomVote, 100);
	flag = true;

}
randomVote = function(){
	var comidas = ['candidato1' , 'candidato4', 'candidato2' ,'candidato3'];
	var randomNumber = Math.floor(Math.random() * 4);
	var choosenOne = comidas[randomNumber];
	var voteCount = Number($("#votos_"+choosenOne+" span").text());

	myFirebaseRef.child(choosenOne).update({
		"votos" : ++voteCount + randomNumber
	}, function(){
		console.log("Se realizo un voto por: " + choosenOne);
	})


}


vote = function(){
	var choise = this.id;
	var voteCount = $("#votos_"+choise+" span").text();
	var self = this.id;
	console.log(Number(voteCount) + 1);
	$('#spinner').addClass('fa-refresh');

	$("#" + choise).prop("disabled" , true);

	myFirebaseRef.child(choise).update({
		"votos" : ++voteCount
		//"votos" : 45
	}, function(){
		$("#" + self).prop("disabled" , false);
		console.log("Se realizo un voto por: " + self);
		$('#spinner').removeClass('fa-refresh');

	})
}


requestData = function(){
	var total;
	$('#spinner').addClass('fa-refresh');
	myFirebaseRef.on("value", function(data){
		total = 0;
		
		chartData = [];
		var comidas = data.val();
		var arr;
		for(comida in comidas){
			console.log(comida, comidas[comida].votos);
			$("#votos_"+comida+" span").text(comidas[comida].votos);
			arr = [comida , comidas[comida].votos]
			chartData.push(arr);
			total += Number(comidas[comida].votos);
			
		}

		$('#total span').html(total);

		chart.load({
		//chart.flow({
			columns: chartData
		});
		$('#spinner').removeClass('fa-refresh');

	})
}

addChart = function(){
	chart = c3.generate({
		bindto: "#chart",
		data: {
			type: 'donut',
			columns: chartData,
			colors: {
				candidato1: '#265a88',
				candidato2: '#2aabd2',
				candidato3: '#eb9316',
				candidato4: '#419641'
			},
			names: {
				candidato1: 'Persona1',
				candidato2: 'Persona2',
				candidato3: 'Persona3',
				candidato4: 'Persona4'
			}
		},
		bar: {
			width: {
				ratio: 1
			}
		},
		tooltip: {
			format: {
				title: function(x){
					return 'Estado de votación';
				}
			}
		},
		axis: {
			//rotated: true,
			y: {
				label: 'Cantidad de votos'
			},
			x: {
				show: true,
				label: 'Candidatos'
			}
		},
		donut: {
			title: 'Candidato favorito'
		}
	})
}