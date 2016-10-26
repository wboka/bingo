var bingoBall = "";
var bingoCard = "";
var bingo = {
	addCard: function(numberOfCards) {
		bingo.addCards(1);
	},
	addCards: function(numberOfCards) {
		if (typeof numberOfCards == "undefined") {
			numberOfCards = 1;
		}

		for (var i = 0; i < numberOfCards; i++) {
			var bArray = [];
			var iArray = [];
			var nArray = [];
			var gArray = [];
			var oArray = [];
			var cardNumbers = {};
			var numbersAvailable = bingo.shuffle(bingo.availableNumbers);

			for (var j = 0; j < numbersAvailable.length; j++) {
				var number = numbersAvailable[j].substring(1, numbersAvailable[j].length);

				switch (numbersAvailable[j].substring(0, 1)) {
					case 'B':
						if (bArray.length <= 5 && bArray.indexOf(number) === -1) {
							bArray.push(number);
							cardNumbers['B' + bArray.length] = number;
						}
						break;
					case 'I':
						if (iArray.length <= 5 && iArray.indexOf(number) === -1) {
							iArray.push(number);
							cardNumbers['I' + iArray.length] = number;
						}
						break;
					case 'N':
						if (nArray.length <= 4 && nArray.indexOf(number) === -1) {
							nArray.push(number);
							cardNumbers['N' + nArray.length] = number;
						}
						break;
					case 'G':
						if (gArray.length <= 5 && gArray.indexOf(number) === -1) {
							gArray.push(number);
							cardNumbers['G' + gArray.length] = number;
						}
						break;
					case 'O':
						if (oArray.length <= 5 && oArray.indexOf(number) === -1) {
							oArray.push(number);
							cardNumbers['O' + oArray.length] = number;
						}
						break;
					default:
						// Something Broke
				}
			}

			$("#playing-area").append(bingoCard(cardNumbers));
		}
	},
	availableNumbers: [],
	calledNumbers: [],
	daub: function() {
		if (!$(this).hasClass("free")) {
			$(this).toggleClass("daubed");

			/*
			if (bingo.calledNumbers.indexOf($(this).data('numberCalled')) === -1) {
				$(this).removeClass("daubed");
			}
			*/
		}
	},
	getNumber: function() {
		return Math.floor(Math.random() * 76) + 1;
	},
	hasBingo: function() {
		var $card = $(this).closest(".bingo-card");
		var $daubed = $card.find(".daubed");
		var possibleBingos = {
			"B": [],
			"I": [],
			"N": [],
			"G": [],
			"O": [],
			"1": [],
			"2": [],
			"3": [],
			"4": [],
			"5": [],
			"BtoODiagonalUp": [],
			"BtoODiagonalDown": [],
			"corners": []
		};

		$daubed.each(function() {
			var letter = $(this).data("letter");
			var row = $(this).data("row");
			var number = $(this).text();
			var letterRow = letter + row;
			var isValidBingo = true;

			if (bingo.calledNumbers.indexOf(letter + number) === -1 && (number.toLowerCase() !== "free")) {
				isValidBingo =  false;
			}

			if (isValidBingo) {
				// Column BINGO
				possibleBingos[letter].push(number);
				// Row BINGO
				possibleBingos[row].push(number);

				// Corners
				if ((/B|O/gi.test(letter)) && (/1|5/gi.test(row))) {
					possibleBingos.corners.push(number);
				}

				// BtoODiagonalDown
				if ((/B1|I2|N3|G4|O5/.test(letterRow))) {
					possibleBingos.BtoODiagonalDown.push(number);
				}

				// BtoODiagonalUp
				if ((/B5|I4|N3|G2|O1/.test(letterRow))) {
					possibleBingos.BtoODiagonalUp.push(number);
				}
			}
		});

		for (var key in possibleBingos) {
			if ((key.toLowerCase() === "corners" && possibleBingos[key].length === 4) || possibleBingos[key].length === 5) {
				$card.find(".call-bingo").after("<div class='alert alert-success text-center bingo'><h1>BINGO!!!</h1>You got BINGO after " + bingo.calledNumbers.length + " balls were called.</div>");
				$card.find(".call-bingo").remove();
				$card.find(".daubable").removeClass("daubable");

				return true;
			}
		}

		return false;
	},
	index: 0,
	initialize: function() {
		while (bingo.availableNumbers.length < 76) {
			var number = Math.floor(Math.random() * 76) + 1;
			var letter = "B";

			if (number > 15) { letter = "I"; }
			if (number > 30) { letter = "N"; }
			if (number > 45) { letter = "G"; }
			if (number > 60) { letter = "O"; }

			if (bingo.availableNumbers.indexOf(letter + number) === -1) {
				bingo.availableNumbers.push(letter + number);
			}
		}
	},
	isStarted: false,
	play: function() {
		bingo.isStarted = true;

		bingo.initialize();

		timer = setInterval(function() {
			if (bingo.isStarted && $(".remove-bingo-card").length > 0) {
				$(".remove-bingo-card").remove();
			}

			if (bingo.isStarted && $("#add-bingo-card").length > 0) {
				if ($(".bingo-card").length === 0) {
					$("#add-bingo-card").click();
				}

				$("#add-bingo-card").remove();
			}

			if (bingo.availableNumbers.length === bingo.calledNumbers.length || $(".bingo").length === $(".bingo-card").length) {
				clearInterval(timer);

				alert("Game Over");

				return;
			}

			$("#bingo-balls").prepend(bingoBall({
				ballType: bingo.availableNumbers[bingo.index].charAt(0).toLowerCase(),
				number: bingo.availableNumbers[bingo.index++]
			}));

			bingo.calledNumbers.push(bingo.availableNumbers[bingo.index - 1]);

			$("#ball-count").text(bingo.availableNumbers.length - bingo.calledNumbers.length);

			$(".call-bingo").click();
		}, 5000);
	},
	removeCard: function() {
		$(this).closest(".bingo-card").remove();
	},
	restart: function() {
		window.location.reload(true);
	},
	shuffle: function(array) {
		var copiedArray = array.slice();
		var m = copiedArray.length, t, i;

		// While there remain elements to shuffle…
		while (m) {
			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = copiedArray[m];
			copiedArray[m] = copiedArray[i];
			copiedArray[i] = t;
		}

		return copiedArray;
	}
};

$(document).ready(function() {
	bingoCard = Handlebars.compile($("#bingo-card-template").html());
	bingoBall = Handlebars.compile($("#bingo-ball-template").html());

	$("#add-bingo-card").on("click", bingo.addCard);
	$("#start-bingo").on("click", bingo.play);
	$("body").on("click", ".remove-bingo-card", bingo.removeCard);
	$("body").on("click", "td.daubable", bingo.daub);
	$("body").on("click", ".call-bingo", bingo.hasBingo);
	$("#restart-bingo").on("click", bingo.restart);
});
