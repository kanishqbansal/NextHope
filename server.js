var express = require("express");
var app = express();
var mysql2 = require('mysql2');
var fileUploader=require("express-fileupload");
var cloudinary=require("cloudinary").v2;
let dbConfig="mysql://avnadmin:AVNS_GG8VueO-UMg2M8IZNJV@mysql-2edb7656-practice-node.l.aivencloud.com:28909/defaultdb"
let mySqlServer=mysql2.createConnection(dbConfig);

app.use(express.urlencoded(true));
app.listen(2004,function(){
    console.log("Server Started");
})

app.get("/",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/index.html";
    resp.sendFile(fullpath);
})

mySqlServer.connect(function(err){
    if(err!=null)
    {
        console.log(err.message);
    }
    else
        console.log("Connected to DB")
    
})

app.get("/save-details",function(req,resp){
    
        mySqlServer.query("INSERT INTO users VALUES (?,?,?,CURDATE(),?)", [req.query.x, req.query.y, req.query.z,"1"], function (err) {
            if (err == null) {
                resp.send("Record Saved Successfully");
            } else {
                console.error("DB Error:", err);
                resp.send(err.message);
            }
        });
    
    
})
app.get("/user-controller",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/user-controller.html";
    resp.sendFile(fullpath);
})
app.get("/block-User",function(req,resp){
    mySqlServer.query("update users set status=? where email=?",[0,req.query.email],function(err,result){
        if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record Update Successsfully");
                else
                    resp.send("Invalid Email ID");
            }
            else
            resp.send(err.message);
    })
});
app.get("/resume-User",function(req,resp){
    mySqlServer.query("update users set status=? where email=?",[1,req.query.email],function(err,result){
        if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record Update Successsfully");
                else
                    resp.send("Invalid Email ID");
            }
            else
            resp.send(err.message);
    })
})
app.get("/all-users",function(req,resp){
    mySqlServer.query("SELECT * from users", function (err,resultAry)
         {
            if (err == null) {

            if(resultAry.length==0)
                 resp.send("Invalid User Id or Password");
            else
            resp.send(resultAry);
        }
        else
        {
            resp.send(err.message)
        }
    })
});
app.get("/login-details",function(req,resp){
    
        mySqlServer.query("SELECT * from users where email=? and pwd=?", [req.query.x, req.query.y], function (err,resultAry)
         {
            if (err == null) {
            
            if(resultAry.length==0)
                 resp.send("Invalid User Id or Password");
            else if(resultAry[0].status==1){
                    resp.send(resultAry[0].utype);
            }else{
                resp.send("Blocked");
            }
            
        }
        else
        {
            resp.send(err.message)
        }
    }
    );
        
})
app.get("/vol-kyc", function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/vol-kyc.html";
    resp.sendFile(fullpath);
})
app.get("/do-fetch-one",function(req,resp){
    mySqlServer.query("SELECT * from vol_kyc where email=?",[req.query.x],function(err,resultAry){
        if (err == null) {
            if(resultAry.length==0)
                 resp.send("invalid email");
            else
            resp.send(resultAry);
        }
        else
        {
            resp.send(err.message)
        }
    })
});


app.use(fileUploader());
cloudinary.config({
    cloud_name:'dvnntojoa',
    api_key:'854395691995237',
    api_secret:'yhSAk2Ls8Bpt4yhqzdOBTX_igAQ'
});

app.post("/submit-vol-kyc", async function (req, resp) {
    let fileName;
    if(req.files!=null){
        fileName=req.files.profilePicInput.name;
        let locationToSave=__dirname+"/pics/"+fileName;
        req.files.profilePicInput.mv(locationToSave);
       try{
        await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;
        });
       }
       catch(err){
        resp.send(err.message);
       }
    }else{
        fileName="nopic.jpg";
    }
    let IDproof;
    if(req.files!=null){
IDproof=req.files.idProofInput.name;
let lts=__dirname+"/pics/"+IDproof;
req.files.idProofInput.mv(lts);
try{
    await cloudinary.uploader.upload(lts).then(function(picUrs){
        IDproof=picUrs.url;
    });
}
catch(err){
    resp.send(err.message);
}
    }else{
        IDproof="nopic.jpg"
    }
    mySqlServer.query("INSERT INTO vol_kyc VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [req.body.email, req.body.name, req.body.contact, req.body.address, req.body.city, req.body.gender, req.body.dob, req.body.qualification, req.body.occupation, req.body.other_info, fileName,IDproof], 
        function (err) {
            if (err == null) {
                resp.send("Volunteer KYC Data Saved Successfully");
            } else {
                resp.send(err.message);
            }
        }
    );
});
app.post("/do-update",async function(req,resp){
    let fileName;
    if(req.files!=null){
        fileName=req.files.profilePicInput.name;
        let locationToSave=__dirname+"/pics/"+fileName;
        req.files.profilePicInput.mv(locationToSave);
       try{
        await cloudinary.uploader.upload(locationToSave).then(function(picUrlResult){
            fileName=picUrlResult.url;
        });
       }
       catch(err){
        resp.send(err.message);
       }
    }else{
        fileName=req.body.hdnFrm;
    }

    let IDproof;
    if(req.files!=null){
IDproof=req.files.idProofInput.name;
let lts=__dirname+"/pics/"+IDproof;
req.files.idProofInput.mv(lts);
try{
    await cloudinary.uploader.upload(lts).then(function(picUrs){
        IDproof=picUrs.url;
    });
}
catch(err){
    resp.send(err.message);
}
    }else{
        IDproof=req.body.hdnFrm1;
    }

    mySqlServer.query("update vol_kyc set name=?, contact=?, address=?, city=?, gender=?, dob=?, qualification=?, occupation=?, other_info=?, profile_pic=?, id_proof=? where email=?",[req.body.name, req.body.contact, req.body.address, req.body.city, req.body.gender, req.body.dob, req.body.qualification, req.body.occupation, req.body.other_info, fileName,IDproof,req.body.email],function(err,result){
        if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record Update Successsfully");
                else
                    resp.send("Invalid Email ID");
            }
            else
            resp.send(err.message);
    })
});

app.get("/client-profile", function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/client-profile.html";
    resp.sendFile(fullpath);
})
app.post("/save-client", function (req, resp) {
    
    mySqlServer.query("INSERT INTO cprofile VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [req.body.email, req.body.name, req.body.business, req.body.bprofile, req.body.address, req.body.city, req.body.contact, req.body.idproof, req.body.idpnumber, req.body.info,], 
        function (err) {
            if (err == null) {
                resp.send("Client Data Saved Successfully");
            } else {
                resp.send(err.message);
            }
        }
    );
});
app.get("/fetch-client",function(req,resp){
    mySqlServer.query("SELECT * from cprofile where email=?",[req.query.x],function(err,resultAry){
        if (err == null) {
            if(resultAry.length==0)
                 resp.send("invalid email");
            else
            resp.send(resultAry);
        }
        else
        {
            resp.send(err.message)
        }
    })
});

app.post("/client-update", function(req,resp){
    
    mySqlServer.query("update cprofile set name=?, business=?, bprofile=?, address=?, city=?, contact=?, idproof=?, idpnumber=?, info=? where email=?",[req.body.name, req.body.business, req.body.bprofile, req.body.address, req.body.city, req.body.contact, req.body.idproof, req.body.idpnumber, req.body.info,req.body.email],function(err,result){
        if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record Update Successsfully");
                else
                    resp.send("Invalid Email ID");
            }
            else
            resp.send(err.message);
    })
});
app.get("/post-job", function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/post-job.html";
    resp.sendFile(fullpath);
})
app.post("/publish-job",function(req,resp){
    mySqlServer.query("insert into jobs values(?,?,?,?,?,?,?,?)",[null,req.body.email,req.body.jobTitle,req.body.jobtype,req.body.address,req.body.city,req.body.education,req.body.contact], 
        function (err) {
            if (err == null) {
                resp.send("Client Data Saved Successfully");
            } else {
                resp.send(err.message);
            }
        })
});
app.get("/search-jobs",function(req,resp){
    mySqlServer.query("select * from jobs where city=? and jobtitle=? and education=?",[req.query.city,req.query.jobtitle,req.query.education],function(err,resultArry){
        if(err==null){
            if(resultArry.length==0){
                resp.send("No jobs Found");
            }else
            resp.send(resultArry);
        }else{
            resp.send(err.message);
        }
    })
})
app.get("/find-work",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/find-work.html";
    resp.sendFile(fullpath);
})
app.get("/all-records-client-city", function (req, resp) {
    mySqlServer.query("select distinct city from jobs ", function (err, result) {
        resp.send(result);
    })
})
app.get("/all-records-client-title", function (req, resp) {
    mySqlServer.query("select distinct jobtitle from jobs ", function (err, result) {
        resp.send(result);
    })
})

app.get("/fetch-jobs",function(req,resp){
    mySqlServer.query("select * from jobs where email=?",[req.query.email],function(err,resArr){
        if(err==null){
            if(resArr.length==0){
                resp.send("No jobs Found");
            }else
            resp.send(resArr);
        }else{
            resp.send(err.message);
        }
    })
})

app.get("/del-job",function(req,resp){
    mySqlServer.query("delete from jobs where jobid=?",[req.query.job],function(err,result){
        if(err==null)
            {
                if(result.affectedRows==1)
                    resp.send("Record deleted Successsfully");
            }
    })
})
app.get("/job-manager",function(req,resp){
    let dirName=__dirname;
    let fullpath=dirName+"/job-manager.html";
    resp.sendFile(fullpath);
})
app.get("/client-dashboard", (req, resp) => {
    let dirName=__dirname;
    let fullpath=dirName+"/client-dashboard.html";
    resp.sendFile(fullpath);
  });
  
  app.get("/volunteer-dashboard", (req, res) => {
    res.sendFile(__dirname + "/volunteer-dashboard.html");
  });
  app.get("/admin-dashboard", (req, resp) => {
    let dirName=__dirname;
    let fullpath=dirName+"/admin-dashboard.html";
    resp.sendFile(fullpath);
  });