
class Stats {
  constructor() {
    this.event_start();
  }

  event_start_ex(now){
	this.start =  now;
    this.ok = 0;
    this.error = 0;
	this.hint = 0;
	this.stop =  null;
  }

  
  event_start(){
	this.event_start_ex( new Date() );
  }
  
  event_stop(){
	this.stop =  new Date();
  }

  event_ok() {
	if (this.stop!=null)
		alert("Stat error.");
	this.ok++;
  }  

  event_error() {
	if (this.stop!=null)
		alert("Stat error.");
	this.error++;
  }  

  event_hint() {
	if (this.stop!=null)
		alert("Stat error.");
	this.hint++;
  }  
 

 
  count_mistakes()
  {
	  return this.error+this.hint*3;
  }
 
  persent_accuracy()
  {
	  return Math.round(  (this.ok/(this.count_mistakes()+this.ok)) * 100 )
  }
 
  seconds(){
	  if (this.start==null) 
		  return 0;
	  let stop = (this.stop==null) ? new Date() : this.stop;
	  let seconds = (stop.getTime() - this.start.getTime()) / 1000;
	  return seconds;
  }
 
  get_text()  {
	let text = "";
	let lf = "<br>"
	text += "OK = "+this.ok.toString()+lf;
	text += "Error = "+this.error.toString()+lf;
	text += "Hint = "+this.hint.toString()+lf;
	text += "sec = "+this.seconds().toString()+lf;
	text += "speed = "+((this.ok+this.error+this.hint)/this.seconds()).toString()+lf;
	text += "res = "+( (this.error+this.hint)/this.ok ).toString();
	return text;
  }
  
  get_result()  {
	  let res = Math.round(  (this.ok/(this.error+this.hint+this.ok)) * 100 );
	  let spd = ((this.ok+this.error+this.hint)/this.seconds()).toFixed(2);
	  return res.toString()+"%, "+spd.toString()+" click/sec";
	  
  }
  
  

  
  
};






class DoubleStats {

  constructor() {
    this.curr = new Stats();
	this.total = new Stats();
  }

  event_start(){
    this.curr.event_start();
	this.total.event_start();
  }
  
  event_stop(){
    this.curr.event_stop();
	this.total.event_stop();
  }

  event_ok() {
    this.curr.event_ok();
	this.total.event_ok();
	  
  }  

  event_error() {
    this.curr.event_error();
	this.total.event_error();
  }  

  event_hint() {
    this.curr.event_hint();
	this.total.event_hint();
  }  
 



}









