$(document).ready(function (){

// helper function to show warnings
	function showWaring(text, added) {
		var warning = document.createElement('div');
		warning.setAttribute('class', 'notify');
		warning.style.backgroundColor = added ? '#a7f78680' : '#ffeb3b94';
		warning.innerHTML = text;
		$("#warn").append(warning);
		setTimeout(function () {
			warning.style.backgroundColor = added ? '#a7f78680' : '#ffeb3b3d';
			warning.style.color = 'grey';
		}, 1500);
		setTimeout(function () {
			warning.remove();
		}, 2000)
	}

	// works when add task button pressed
	$('#btn1').click(function(){
		// get all data from inputs
		const titleEl = $('input[name="title"]');
		const title = titleEl.val();
		const deadlineEl = $('input[name="deadline"]');
		const deadline = deadlineEl.val();
		const commentEl= $('textarea[name="comment"]');
		const comment = commentEl.val();
		// form json format
		const data = {
		        title: title,
		        deadline: deadline,
		        comment: comment
	    	};


		if(title && deadline) { // if title and date is non empty
			// send data to add_task method of POST
			$.ajax({
				type: 'POST',
				url: $SCRIPT_ROOT + '/add_task',
				data: JSON.stringify(data, null, '\t'),
				contentType: 'application/json;charset=UTF-8',
				success: function (data) { // if successfully added
					if (data.success) { // check manual status
						showWaring('Added', true); // show dialog about successful addition
						var item = document.createElement("a"); // create anchor and insert into DOM with all data passed
						item.setAttribute("href", "#" + data.id);
						item.setAttribute("class", "list-group-item");
						item.setAttribute("tooltip", comment);
						item.innerHTML= title + ' <span class="label label-default">' + deadline + '</span> ';
						$('.list-group').append(item);
					}

				}
			});
		}
		else if(!title) { // depending of empty field show warning
			showWaring('<b>Title &nbsp;</b> is not filled');
		}
		else if(!deadline) {
			showWaring('<b>Deadline &nbsp;</b> is not filled');
		}
		// make all input fields empty
		titleEl.val("");
		deadlineEl.val("");
		commentEl.val("");
		      return false;
	});


// works if task is pressed
	$('a').click(function () {
		var id;
		setTimeout(function(){
			id = window.location.hash.substring(1); // get ID for url hash
			var isCompleted = $("a[href='#" + id + "']").hasClass('list-group-item-success'); // check if task is already completed
			if(!isCompleted) { // if not completed send POST method with id parameter
				$.ajax({
					type: 'POST',
					url: $SCRIPT_ROOT + '/complete_task',
					data: JSON.stringify({id: id }),
					contentType: 'application/json;charset=UTF-8',
					success: function(data) {
						// if successfully updated show task as completed
						if(data.result) {
							$("a[href='#" + id + "']").attr('class', 'list-group-item list-group-item-success')
						}
					}
				})
			}
			else { // if task has been already completed show warning
				showWaring('Task Already Completed')
			}

		}, 10);

	})

});
