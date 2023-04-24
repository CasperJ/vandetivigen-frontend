interface Env {
	KV: string;
}

interface Record {
    RecordedOn: Date;
    Temperature: number;
    Temperature2: number;
  }
  

export const onRequest: PagesFunction<Env> = async (context) => {
	//const value = await context.env.KV;
    const readings : Record[] = [
        { RecordedOn: new Date(2023, 4,1,12,0,0), Temperature: 10.8, Temperature2: 11.8 },
        { RecordedOn: new Date(2023, 4,1,13,0,0), Temperature: 11.8, Temperature2: 11.7 },
        { RecordedOn: new Date(2023, 4,1,14,0,0), Temperature: 12.8, Temperature2: 11.4 },
        { RecordedOn: new Date(2023, 4,1,15,0,0), Temperature: 11.8, Temperature2: 11.2 },
        { RecordedOn: new Date(2023, 4,1,16,0,0), Temperature: 10.8, Temperature2: 11.8 },
      ];
 	return Response.json(readings);
}