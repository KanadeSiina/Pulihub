import axios from "axios";
import https from "https";
import fs from "fs";

function store(uid: string, record: any) {
  console.log(`Store a record of uid ${uid}: `, record);
  fs.readFile("static/video.json", function (_err, data) {
    const parsed_data = JSON.parse(data.toString());
    parsed_data[uid] = record;
    console.log(parsed_data);
    fs.writeFile(
      "static/video.json",
      JSON.stringify(parsed_data, null, "\t"),
      function (err) {
        if (err) console.log(err);
        console.log("Store success.");
      }
    );
  });
}

export const bhpan = {
  getRecord: async (link: string) => {
    const url = "https://bhpan.buaa.edu.cn/api/v1/link?method=get";
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    const res = await axios.post(
      url,
      {
        link: link,
        password: "",
      },
      { httpsAgent }
    );
    const data = res.data;
    return {
      link: link,
      password: "",
      docid: data["docid"],
      reqhost: "bhpan.buaa.edu.cn",
      usehttps: true,
      savename: data["name"],
    };
  },
  insertRecord: async (data: any) => {
    const link = data["link"];
    const postdata = await bhpan.getRecord(link);
    const newData = {
      postdata: postdata,
      poster: data["poster"],
      title: data["title"],
      desc: data["desc"],
      category: data["category"],
      is_public: true,
      type: data["type"],
    };
    const uid = data["uid"];
    store(uid, newData);
  },
};

export const fileRecoder = {
  insertRecord: async (data: any) => {
    const link = data["link"];
    const newData = {
      link: link,
      poster: data["poster"],
      title: data["title"],
      desc: data["desc"],
      category: data["category"],
      is_public: true,
      type: data["type"],
    };
    const uid = data["uid"];
    store(uid, newData);
  },
};
