interface Env {
	DATA: KVNamespace;
}

interface Record {
    RecordedOn: Date;
    Temperature: number;
    Temperature2: number;
  }
  

export const onRequest: PagesFunction<Env> = async (context) => {
	  const data = await context.env.DATA.get("sensor_data");

    const json = JSON.parse(data) as Array<{t1:number, t2:number, r:Date}>;
    const readings : Record[] = json.map(j=> {return {Temperature: j.t1, Temperature2: j.t2, RecordedOn: j.r}});
 	return Response.json(readings);
}