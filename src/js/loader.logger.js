export class Logger
{
	addChat (txt)
	{
		this.log(txt);
	}

	log (txt)
	{
		console.log("haxjs: "+txt)
	}
}