//I WASTED LIKE TWO DAYS WORHT OF PROGRESS JUST TO MAKE THIS KINDA ACHIEVEING LINE OF CODES.
//IT STARTED AS A THOUGHT BUT WHEN I STARTED IT, I JUST KNEW THAT I SHOULD DO THIS AND NOTHING
//ELSE ARE IMPORTANT. IT'S CHALLENGING BUT A STRAIGHTFORWARD CONCEPT OF SOLUTION. 

//A DAY AFTER
//I HAVE NOW SUCCEEDED TO MAKE THE FUNCTION ACCEPT AN ORDER PARAMATERS WHICH SETS WHETHE THE SORTING
//SHOULD IN ASCENDING OR DESCENDING. I MADE I A NUMBER SO THAT THE FUNCTION WILL HAVE FASTER COMPARISON
//OPERATORS OR WHATNOT, STRINGS I THINK WILL SLOW THINGS A LITTLE BIT.
const sort = ({
	data = Object, 
	sortby = "", 
	order = 1 
}) => {
	let arr_objectData_sorted = [];
	let arr = {
		sorted: {
			sort: Object.keys(data).map((e, index)=>data[e][sortby]),
			key: Object.keys(data).map(e=>Number(e)),
		},
		unsorted: {
			sort: Object.keys(data).map((e, index)=>data[e][sortby]), //I JUST WANTED TO KEEP THIS ALIVE. IT KEEPS MY HEAD WRAPPED TO THE philosophy or something OF MY SOLUTION
		}
	};
	let current = {
		SortElement: undefined,
		SubsortCheck: undefined,
	}
	let elementSwap = {
		first_elem_swap: undefined,
		end_elem_swap: undefined
	}
	let array_stats = {
		highest_num: 0,
		lowest_num: 0,
	}
	const swapElements = ({firstElem, endElem}) => {
		elementSwap.first_elem_swap = [arr.sorted.sort[firstElem], arr.sorted.key[firstElem]];
		elementSwap.end_elem_swap = [arr.sorted.sort[endElem], arr.sorted.key[endElem]];
		arr.sorted.sort[endElem] = elementSwap.first_elem_swap[0];
		arr.sorted.sort[firstElem] = elementSwap.end_elem_swap[0]; 
		arr.sorted.key[endElem] = elementSwap.first_elem_swap[1];
		arr.sorted.key[firstElem] = elementSwap.end_elem_swap[1];
		arr_objectData_sorted[endElem] = data[arr.sorted.key[endElem]];
		arr_objectData_sorted[firstElem] = data[arr.sorted.key[firstElem]];
	};
	for (const key in arr.unsorted.sort)
	{
		if (arr.unsorted.sort[array_stats.lowest_num] > arr.unsorted.sort[key]) array_stats.lowest_num = Number(key);
		if (arr.unsorted.sort[array_stats.highest_num] < arr.unsorted.sort[key]) array_stats.highest_num = Number(key);
	}
	let allLessThan = true;
	if (order)
	{
		for (let i = 0; i < 2; ++i)
		{
			swapElements({
				firstElem: [array_stats.lowest_num, array_stats.highest_num][i],
				endElem: [0, arr.unsorted.sort.length - 1][i]
			})
			if (array_stats.highest_num === 0) { array_stats.highest_num = array_stats.lowest_num; }
			if (i == 0) array_stats.lowest_num = 0;
			else array_stats.highest_num = (arr.unsorted.sort.length - 1)
		}
		for (let uns_key = 1; uns_key < (arr.unsorted.sort.length - 2); ++uns_key)
		{
			allLessThan = true
			for (let check_key = 1 + uns_key; check_key < (arr.unsorted.sort.length - 1); ++check_key)
			{
				current.SortElement = arr.sorted.sort[uns_key];
				current.SubsortCheck = arr.sorted.sort[check_key];
				if (current.SortElement > current.SubsortCheck)
				{
					allLessThan = false;
					swapElements({firstElem: uns_key, endElem: check_key});
				}
			}
			if (allLessThan) arr_objectData_sorted[uns_key] = data[arr.sorted.key[uns_key]];
		}
	}
	else 
	{
		for (let i = 1; i >= 0; --i)
		{
			swapElements({
				firstElem: [array_stats.lowest_num, array_stats.highest_num][i],
				endElem: [arr.unsorted.sort.length - 1, 0][i]
			})
			if (array_stats.lowest_num === 0) { array_stats.lowest_num = array_stats.highest_num; }
			if (i == 1) array_stats.highest_num = 0;
			else array_stats.lowest_num = (arr.unsorted.sort.length-1)
		}
		for (let uns_key = (arr.unsorted.sort.length - 2); uns_key > 2; --uns_key)
		{
			allLessThan = true
			for (let check_key = (uns_key - 1); check_key > 0; --check_key)
			{
				current.SortElement = arr.sorted.sort[uns_key];
				current.SubsortCheck = arr.sorted.sort[check_key];
				if (current.SortElement > current.SubsortCheck)
				{
					allLessThan = false;
					swapElements({firstElem: uns_key, endElem: check_key});
				}
			}
			if (allLessThan) arr_objectData_sorted[uns_key] = data[arr.sorted.key[uns_key]];
		}
	}
	return arr_objectData_sorted;
}

const load_polls = async () => {
	response = await api_get_req({
		api_link: api.type.question,
		accept: api.accept.json,
	});
	data = await response.json();
	console.log(data);
	data = data.questions;
	try {
		initiate_survey(sort({
			data: data,
			sortby: 'sort',
		}));
	}
	catch (error) {
		console.error(error);
		alert("JS files fetch error.\nPlease reload page")
	}
};
$(document).ready(() => {
	const promise = new Promise((resolve, reject) => {
		$.getScript(`${urls.static}poll_front/js/polls-feed.js`, function (script) {
			initiate_poll_feed();
			resolve(200);
		});
	});
	promise.then((response) => {
		load_polls();
	});
});
