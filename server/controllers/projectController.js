import prisma from "../configs/prisma.js";

export const createProject = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const {
      workspaceId,
      description,
      name,
      status,
      start_date,
      end_date,
      team_members,
      team_lead,
      progress,
      priority,
    } = req.body;

    //  check if user. have admin role for work space 

    const workspace = await prisma.workspace.findUnique({
        where:{id:workspaceId},
        include:{members:{include:{user:true}}}
    })
    if(!workspace){
        return res.status(404).json({message:"workspace not found"})
    }
    if(!workspace.members.some((member)=>member.userId===userId && member.role==="ADMIN")){
         return res.status(403).json({message:"You dont have permission to create  project in this workspace "})

    }

//  get team lead using email

const teamLead = await prisma.user.findUnique({
    where:{email:team_lead},
    select:{id:true}
})

const Project = await prisma.project.create({
    data:{
        workspaceId,
        name,
        description,
        status,
        priority,
        progress,
        team_lead:team_lead?.id,
        start_date:start_date ?new Date(start_date):null,
        end_date:end_date ?new Date(end_date):null,

    }
})

//  add memeber to project if they are in the workspace

if(team_members?.length>0){
    const membersToAdd =[]
    workspace.members.forEach(member=>{
        if(team_members.includes(member.user.email)){
            membersToAdd.push(member.user.id)
        }
    })
         await prisma.projectMember.createMany({
            data:membersToAdd.map(memberId=>({
                projectId:project.id,
                userId:memberId
            }))
         })
}

       const projectWithMembers = await prisma.project.findUnique({
        where:{id:project.id},
        include:{
            members:{ include:{user:true} },
            tasks:{include:{assignee:true},comments:{include:{user:true}}},
            owner:true
        }
       })
       res.json({project:projectWithMembers,message:"Project Created succesfully"})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Update Project

export const updateProject = async (req, res) => {
  try {
    const {userId} = await req.auth();
    const {id, 
         workspaceId,
         description,
         name,
         status,
         start_date,
         end_date,
         progress,
         priority,}=req.body;

            //  check if user has admin roll or not 

        
    const workspace = await prisma.workspace.findUnique({
        where:{id:workspaceId},
        include:{members:{include:{user:true}}}
    })

    // console.log("hello")


    if(!workspace){
        
         return res.status(404).json({message:"workspace not found"})
    }

    if(!workspace.members.some(()=>member.userId===userId && member.role=== "ADMIN")){
        const project = await prisma.project.findUnique({
            where:{id}
        })
        if(!project){
            return res.status(404).json({message:"project is not available "})
        }
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// add memeber to project

export const addMember = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
