/**
 * Created by hxiao on 2016/10/27.
 */
var logic = {
    "welcome": {
        question: [
            "你好, 有什么关于德国博士申请的问题要问么?",
            "最近怎么样啊? 关于德国的博士申请有什么问题么?"
        ],
        answer: {
            "你是谁啊?": "about_myself",
            "有啊, 一堆问题": "introducing",
            "暂时还没有": "goodbye"
        }
    },
    "about_myself": {
        question: [
            "我是肖涵, 是这个app的作者. 我曾在知乎上回答关于德国博士申请的问题, 获得很多人的好评." +
            "后来我建立了自己的咨询服务, 在微信中为150多位同学提供了一对一的免费咨询."
        ],
        answer: {
            "你什么背景啊?": "myself_background",
            "好吧, 我有问题要问你": "introducing"
        },
        keyword: [
            "你是谁", "作者", "你好"
        ]
    },
    "myself_background": {
        question: [
            "我于2009年至2014年在德国慕尼黑工业大学计算机系, 先后取得了硕士和博士学位," +
            "方向为机器学习. 硕士期间三学期就修满120学分优异毕业. 博士期间导师为德国国家工程院院士," +
            " 由学校提供全额工作合同. 13年曾在国立台湾大学做半年访问学者, " +
            "并获得中国教育部13年海外优秀博士生. 2014年博士毕业后居住在柏林, 现从事数据科学家的工作."
        ],
        answer: {
            "你也在互联网行业?": "myself_internet",
            "我有申请方面的问题要问": "introducing",
            "没事了": "goodbye"
        },
        keyword: [
            "你是谁", "作者"
        ]
    },
    "myself_internet": {
        question: ["是的, 你可以访问<a href='https://de.linkedin.com/in/hxiao87' " +
        "class='item-link external' target='_blank'><i class='fa fa-external-link' " +
        "aria-hidden='true'></i> 我的LinkedIn</a> 去看我的详细信息"],
        answer: {
            "好吧, 我有申请方面的问题要问": "introducing",
            "没事了": "goodbye"
        }
    },
    "random_ask": {
        question: [
            "你还有什么其他的问题么?",
            "ok, 那你现在还有啥事儿么?"
        ]
    },
    "goodbye": {
        question: [
            "ok, 有事儿再找我昂",
            "好的, 想到什么问题再问我"
        ]
    },
    "introducing": {
        question: [
            "你能先简单介绍一下自己么? 你现在正读研呢么?",
            "ok, 你可以先介绍一下自己, 你现在读研么还是?"
        ],
        answer: {
            "对啊": "ask_master_uni",
            "我还在读本科": "bachelor_in_study",
            "我在读博士": "doctor_in_study",
            "我已经工作了": "already_work"
        }
    },
    "ask_master_uni": {
        question: [
            "请问你硕士在哪里读的呢?"
        ],
        answer: {
            "国内985, 211": "ask_master_subject",
            "国内其他院校": "ask_master_subject",
            "国外院校": "ask_master_subject"
        }
    },
    "ask_master_subject": {
        question: [
            "请问你硕士读的哪个方向呢?"
        ],
        answer: {
            "理科": "ask_master_record",
            "工科": "ask_master_record",
            "文科": "ask_master_record",
            "商科": "ask_master_record",
            "医学": "ask_master_record"
        }
    },
    "ask_master_record": {
        question: [
            "那你硕士期间成绩怎么样呢?"
        ],
        answer: {
            "一般吧": "good_record",
            "能排进前20%": "good_record",
            "呃, 不是很理想": "good_record"
        }
    },
    "good_record": {
        question: ["一个优秀的硕士毕业成绩对申请德国博士非常重要." +
        "我在TUM读博的时候, 组里其他博士生的硕士毕业成绩都<1点5. 在德国1为最好, 5为最差. " +
        "一般来说, 教授对这方面有比较严格的要求. " +
        "理由和原因也很简单, 你硕士期间不会发出什么惊天动地的论文. " +
        "也不会有太丰富的研究经验. 唯一能够客观衡量你潜在学术水平的. 就是你的硕士成绩."],
        answer: {
            "我有研究经历": "research_experience",
            "我有工作实习经历": "work_experience",
            "我有出国交换经历": "aboard_experience",
            "我暂时什么都没有": "prepare_phd"
        },
        keyword: [
            "我的成绩", "硕士成绩", "成绩", "GPA", "绩点"
        ]
    },
    "research_experience": {
        question: ["有研究成果肯定是加分项. 发表的国际会议或期刊的论文, " +
        "在实验室的研究, 跟着大牌教授干活, 这些都是很好的经历."],
        answer: {
            "我该什么时候开始申请呢": "apply_time",
            "明白了": "random_ask"
        },
        keyword: [
            "研究", "论文", "发表", "SCI", "会议", "期刊"
        ]
    },
    "work_experience": {
        question: ["ok. 有与专业相关的工作经历是加分项. 学生教授一般也喜欢要有一定工作经历的人, " +
        "做事会比较有条理, 起点会略高一些."],
        answer: {
            "我该什么时候开始申请呢": "apply_time",
            "明白了": "random_ask"
        },
        keyword: [
            "工作", "实习", "经历"
        ]
    },
    "aboard_experience": {
        question: ["挺好的. 有出国的经历对申请也有帮助."],
        answer: {
            "我该什么时候开始申请呢": "apply_time",
            "明白了": "random_ask"
        }
    },
    "apply_time": {
        question: ["如果你还没有硕士毕业, 太早的联系教授并不可取." +
        "原因是德国博士一般明确要求有硕士学历. 对于德国教授来说, " +
        "不能因为你预计明年毕业, 就现在给你博士生的offer. 尤其是那种带奖学金或工作合同的, 更是如此. " +
        "教授她会有疑虑, 他无法证明你什么时候毕业, 也无法保证你毕业时成绩如你所说的那样优秀. " +
        "另外, 对于其他出示了硕士学历的申请者来说不公平."],
        answer: {
            "可是毕业离开学校后不方便了啊": "optimal_time",
            "申请步骤是怎么样的?": "apply_process",
            "明白了": "random_ask"
        },
        keyword: [
            "申请", "时间", "时候", "联系", "套磁", "套词"
        ]
    },
    "optimal_time": {
        question: ["所以我推荐你硕士论文开题前后, 大约离毕业还半年的时间, 开始与教授陶陶瓷. " +
        "这样也能保证你硕士论文和未来教授的方向接轨."],
        answer: {
            "申请步骤是怎么样的?": "apply_process",
            "明白了": "random_ask"
        },
        keyword: [
            "申请", "时间", "时候", "联系", "套磁", "套词", "开题", "教授"
        ]
    },
    "already_work": {
        question: [
            "ok. 有与专业相关的工作经历是加分项. 学生教授一般也喜欢要有一定工作经历的人, " +
            "做事会比较有条理, 起点会略高一些."
        ],
        answer: {
            "我快30了, 会不会有点老": "age_problem",
            "我该怎么申请呢": "ask_master_uni"
        },
        keyword: [
            "工作", "实习", "经历"
        ]
    },
    "age_problem": {
        question: [
            "不会的. 德国大学里平均年龄都比中国大学里要大. 服兵役, 旅游, 出国交换, 生孩子." +
            "我在慕尼黑工大的时候, 教授手下的博士生都比我大不少. 博士生在德国除了研究, 生活更重要." +
            "德国人懂这点, 所以完全不会在意你年龄的大小的. 况且, 中国人本来面相就显年轻. 不用担心"
        ],
        answer: {
            "我知道了": "ask_master_uni"
        },
        keyword: [
            "年纪", "年龄", "老了", "太老"
        ]
    },
    "bachelor_in_study": {
        question: [
            "是这样, 本科生一般是无法直接申请德国博士的. 德国大学通常会要求具有硕士学位." +
            "不过有些大学和研究所会有个别项目允许硕博连读. 这样的项目非常非常少."
        ],
        answer: {
            "好吧": "random_ask",
            "个别项目?": "structured_phd",
            "我想提前规划一下硕士": "prepare_phd"
        }
    },
    "structured_phd": {
        question: [
            "是的, 这种项目一般叫做Structured PhD Program, 你可以去网上搜一下," +
            "一般是由研究所比如马普所和大学合办的. 比较著名的就是Saarland 大学和马普计算所合办的计算机博士项目," +
            "5年2+3, 前2年是带奖学金的硕士, 2年后你可以选择是不是继续读博."
        ],
        answer: {
            "好吧": "random_ask",
            "这样的项目好申请么?": "structured_phd>difficulty"
        }
    },
    "structured_phd>difficulty": {
        question: [
            "像这种项目一般要求是非常高的, 我记得Saarland大学是说你排名前10%才可以尝试." +
            "柏林自由大学数学系我记得好像也是有的, 也是要求非常非常高."
        ],
        answer: {
            "好吧": "random_ask",
            "申请步骤是什么?": "graduate_apply"
        }
    },
    "apply_process": {
        question: [
            "分两种, 一种是直接和教授申请. 一种是通过研究生院申请. 虽然德国一些比较国际化的学校都已经成立研究生院, " +
            "不过由于历史原因, 和教授直接申请仍然占主流."
        ],
        answer: {
            "我想直接和教授申请": "prof_apply",
            "我通过研究生院申请": "graduate_apply"
        }
    },
    "prof_apply": {
        question: [
            "首先是和教授套磁, 发一封简短的信, 附上CV. 如果教授对你感兴趣, 可能会有一轮面试. 最后会有三种情况, 一种是教授决定要你并且给你工作合同, 一种是" +
            "教授同意你拿到稳定的资金来源后录取你, 第三种就是婉拒, 说组里没职位."
        ],
        answer: {
            "面试什么?": "interview_problems",
            "需要哪些材料": "request_material",
            "那接下来呢?": "next_step",
            "稳定的资金来源?": "funding_issue"
        }
    },
    "request_material": {
        question: [
            "简历(CV), 自荐信(motivation letter), 推荐信(recommendation letter), 还有就是研究计划(research outline)"
        ],
        answer: {
            "那下一步呢?": "next_step",
            "你能帮我做简历么?": "ask_help",
            "发完材料多长时间会有回复?": "review_time"
        }
    },
    "next_step": {
        question: [
            "一旦教授决定要你了, 资金问题也落实后, 那下一步就是走走学校的流程, 办理些手续文件, 没有什么大问题. " +
            "学校给你录取通知后,你就可以拿着这些材料去办签证了."
        ],
        answer: {
            "明白了": "random_ask",
            "那语言方面有没有要求呢?": "language_requirement",
            "资金问题怎么落实?": "funding_issue"
        }
    },
    "funding_issue": {
        question: [
            "稳定的资金来源有三种, 一个是德国大学或研究所提供的工作合同, 另一个是DAAD和CSC等学术机构提供的奖学金, " +
            "最后一种是德国公司给你的" +
            "工作合同, 你拿着这种合同一周三四天在公司, 一两天在学校, 作External PhD."
        ],
        answer: {
            "我能自费读博么?": "self_funding",
            "CSC奖学金?": "csc_funding",
            "在公司干活?": "external_phd",
            "明白了": "random_ask"
        }
    },
    "csc_funding": {
        question: ["CSC是国家公派留学生奖学金, 由中国国家留学基金委提供, 资助期限一般为36-48个月. 申请者需已获得国外院校邀请函."],
        answer: {
            "什么邀请函啊?": "invitation_letter",
            "去哪申请啊?": "csc_url",
            "那接下来呢?": "next_step",
            "明白了": "random_ask"
        }
    },
    "invitation_letter": {
        question: ["实际上CSC不是一个巴掌能拍得响的. CSC那边需要教授要你才给你钱, 教授那边又希望你有钱才能给你offer. 鸡生蛋蛋生鸡." +
        "所以重要的是能让教授那边给你一个带条件的offer, 给你一封推荐信, 你拿着这封推荐信再去申请CSC."],
        answer: {
            "这封信得包含什么内容啊?": "csc_letter",
            "去哪申请啊?": "csc_url",
            "那接下来呢?": "next_step",
            "明白了": "random_ask"
        }
    },
    "csc_letter": {
        question: ["大体意思就是: 这位同学很优秀, 怎么怎么优秀, 我想要他作我什么方向的博士生, " +
        "我得知中国政府鼓励优秀的学生出国深造 我觉得中国在教育上的投资是长远而明智的. " +
        "希望CSC能批准这位同学的奖学金 其余德国方面的事情就交给我吧. "],
        answer: {
            "那接下来呢?": "next_step",
            "去哪申请啊?": "csc_url",
            "明白了": "random_ask"
        }
    },
    "csc_url": {
        question: ["去<a href='http://www.csc.edu.cn/require/degree.asp'" +
        "class='item-link external' target='_blank'>" +
        "<i class='fa fa-external-link' aria-hidden='true'></i> CSC官方网站</a> 按照步骤操作就可以了."],
        answer: {
            "那接下来呢?": "next_step",
            "明白了": "random_ask"
        }
    },
    "self_funding": {
        question: [
            "对于中国人很难. 德国大学没有学费, 所以理论上你只需要负担生活费就可以. 但是实际上, 如果你不是德国人或者欧盟公民, " +
            "如果没有稳定的资金来源, 移民局和外管局根本不会批你的签证, 你都无法进入德国. 至于德国大学, 倒无所谓你是不是自费. " +
            "所以自费的问题不是在大学, 而是在签证."
        ],
        answer: {
            "明白了": "random_ask",
            "那下一步呢?": "next_step",
            "我有些积蓄, 这能算稳定的资金来源么": "saving_funding"
        }
    },
    "saving_funding": {
        question: [
            "不算."
        ],
        answer: {
            "明白了": "random_ask",
            "那下一步呢?": "next_step"
        }
    },
    "graduate_apply": {
        question: [
            "有些德国大学改制后, 为了管理越来越多的国际博士生, 成立了研究生院, 就是Graduate School. " +
            "比如本科直博的这种特殊申请都是通过研究生院进行的." +
            "这种情况下, 官方网站上会把申请步骤写的比较清楚, 申请截止时间, 通知时间也基本都是固定的."
        ],
        answer: {
            "我明白了": "random_ask",
            "那我需要准备什么材料?": "request_material",
            "那教授还有决定权么?": "prof_decision"
        }
    },
    "prof_decision": {
        question: [
            "有啊. 研究生院首先对申请者的简历,背景,筛查评估一遍. 如果没有问题, 就会把你的申请材料转交给教授." +
            "最终的决定权还是在教授手里的. 如果教授对你有兴趣, 还可能会找你视频面试."
        ],
        answer: {
            "我明白了": "random_ask",
            "面试都什么内容啊?": "interview_problems"
        }
    },
    "prepare_phd": {
        question: [
            "德国的博士录取实际上主要看以下两点, 1 成绩. 2 研究和实习经历. 所以" +
            "在硕士期间你一定要把成绩保持好. 至于研究经历, 理工科比较讲究论文发表, 能有一两篇" +
            "国际会议期刊论文就很好啦. 或者实习经历甚至工作经历都是加分项"
        ],
        answer: {
            "这样啊": "random_ask",
            "那语言方面有没有要求呢?": "language_requirement",
            "那接下来呢?": "next_step"
        }
    },
    "language_requirement": {
        question: [
            "你是说德语和英语要求么?"
        ],
        answer: {
            "嗯嗯, 德语有什么要求呢?": "german_requirement",
            "我不会德语, 用英语可以么?": "english_requirement"
        }
    },
    "german_requirement": {
        question: [
            "实际上德国的博士招生一般没有统一而明确的语言要求" +
            "主要是看教授, 如果教授招的博士职位需要用德语, 那就是德语."
        ],
        answer: {
            "明白了": "random_ask",
            "有没有什么德语测试呢?": "testdaf"
        }
    },
    "testdaf": {
        question: [
            "有啊. 有一个德福考试(TestDaF) 就是类似英语中的托福考试." +
            "一般德国的硕士会有明确的要求, 需要过德福考试. 就是听说读写得4个4以上就可以"
        ],
        "answer": {
            "明白了": "random_ask",
            "教授会面试我么?": "interview_problems"
        }
    },
    "english_requirement": {
        question: [
            "还是那句话. 德国的博士招生一般不会有明确的语言分数要求." +
            "英语也一样. 博士的录取一般涉及到面试. 面试的时候教授会直接和你交流. " +
            "到时候你的语言能力的好坏很容易就能看出来了."
        ],
        "answer": {
            "明白了": "random_ask",
            "面试都会问些什么呢": "interview_problems",
            "接下来呢?": "next_step"
        }
    },
    "interview_problems": {
        question: [
            "一般就是自我介绍, 研究经历, 让你讲讲你最得意的研究经历或是某篇论文. " +
            "会顺着你的论文问下去. 顺带着也会问一下这个领域内的基础知识."
        ],
        "answer": {
            "明白了": "random_ask",
            "面试完多久能有结果?": "review_time",
            "接下来呢?": "next_step"
        }
    },
    "review_time": {
        question: [
            "如果教授对你感兴趣,一般会在两周之内给你一个答复. 在德国教授的决定权很大," +
            "所以他一般也不需要等学校的手续. 当然赶上8月9月德国的休假旺季, 教授肯定以休假优先."
        ],
        "answer": {
            "明白了": "random_ask",
            "接下来呢?": "next_step"
        }
    }
};


function freeTextQA(x, y) {

}