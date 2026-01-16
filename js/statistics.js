const CSV_FILE_NAME = "wp_statistics.csv";


$(document).ready(function () {
	

	$("#downloadCsvBtn").on("click", downloadCSV );



	
	processRows();
		
});



function formatDate(date) {
    const pad = n => String(n).padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0–11
    const day = pad(date.getDate());

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}





async function downloadCSV()
{
	const lf = "\r\n";
	const comma = ", "
	
	const rows = await DB_getall();
	const text = [];
	text.push("date,file,index,length,ok,error,hint,time")
	rows.forEach(row => {
		text.push(
			'"'+formatDate(row.date) + '"'+comma+
			'"'+row.file.toString()+'"'+comma+
			row.index.toString()+comma+
			row.length.toString()+comma+
			row.ok.toString()+comma+
			row.error.toString()+comma+
			row.hint.toString()+comma+
			row.time.toString()
			);
    });	
	
	const csvText = text.join(lf);
	downloadFile(CSV_FILE_NAME, csvText);	

}



function downloadFile(filename, text) {

    const csvText = text;

    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}





async function processRows() {

    const dataByDay = {};
	
	const rows = await DB_getall();
	
	console.log("DB:",rows.length,"rows");

    rows.forEach(row => {

		let d = row.date.getDate().toString().padStart(2, '0');
        let m = (row.date.getMonth()+1).toString().padStart(2, '0');
        let y = row.date.getFullYear().toString();
		
		const day = y+"-"+m+"-"+d;	
        if (!dataByDay[day]) 
            dataByDay[day] = {  ok: 0, error: 0, hint: 0, time: 0 };
        dataByDay[day].ok += row.ok;
        dataByDay[day].error += row.error;
        dataByDay[day].hint += row.hint;
        dataByDay[day].time += row.time;	
    });

    const days = Object.keys(dataByDay).sort();

    const totalOk = [];
    const okPerError = [];
    const okPerHint = [];
    const totalTime = [];

    days.forEach(day => {
        const d = dataByDay[day];
        totalOk.push(d.ok);
        okPerError.push(d.ok > 0 ? d.error / d.ok : null);
        okPerHint.push(d.ok > 0 ?  d.hint / d.ok : null);
        totalTime.push(d.time/60);
    });

    drawPlot("plot-ok", days, totalOk, "OK");
    drawPlot("plot-ok-error", days, okPerError, "Error/OK");
    drawPlot("plot-ok-hint", days, okPerHint, "Hint/OK");
    drawPlot("plot-time", days, totalTime, "Time (minutes)");

}

function drawPlot(elementId, x, y, title) {
    const trace = {
        x: x,
        y: y,
        mode: "markers+lines",
        type: "bar"
        
    };

    const layout = {
        title: title,
		xaxis: {
			title: "Date",
			tickmode: "array",
			tickvals: x,
			ticktext: x.map(d => {
				const date = (d instanceof Date) ? d : new Date(d);
				return String(date.getDate()).padStart(2, "0") + "." +
					   String(date.getMonth() + 1).padStart(2, "0");
			}),
			tickangle: -45
		},
        yaxis: { automargin: true },
		bargap: 0.2,
        margin: { t: 50 }
    };

    Plotly.newPlot(elementId, [trace], layout, { responsive: true });
}
