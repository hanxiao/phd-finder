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
            "有啊, 一堆问题": "introducing",
            "暂时还没有": "goodbye"
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
            "对啊": "master_in_study",
            "我还在读本科": "bachelor_in_study",
            "我在读博士": "doctor_in_study",
            "我已经工作了": "work_in_study"
        }
    },
    "ask_master_uni": {
        question: [
            "请问你硕士是哪个大学呢?",
            "请问你硕士在哪里读的呢?"
        ]
    },
    "work_in_study": {
        question: [
            "ok. 有与专业相关的工作经历是加分项. 学生教授一般也喜欢要有一定工作经历的人, " +
            "做事会比较有条理, 起点会略高一些."
        ],
        answer: {
            "我快30了, 会不会有点老": "age_problem",
            "我该怎么申请呢": "ask_master_uni"
        }
    },
    "age_problem":{
        question: [
            "不会的. 德国大学里平均年龄都比中国大学里要大. 服兵役, 旅游, 出国交换, 生孩子." +
            "我在慕尼黑工大的时候, 教授手下的博士生都比我大不少. 博士生在德国除了研究, 生活更重要." +
            "德国人懂这点, 所以完全不会在意你年龄的大小的. 况且, 中国人本来面相就显年轻. 不用担心"
        ],
        answer: {
            "我知道了": "ask_master_uni"
        }
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
            "好吧": "random_ask"
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
            "那语言方面有没有要求呢?": "language_requirement"
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
            "好吧": "random_ask",
            "有没有什么德语测试呢?" : "testdaf"
        }
    },
    "testdaf": {
        question: [
            "有啊. 有一个德福考试(TestDaF) 就是类似英语中的托福考试." +
            "一般德国的硕士会有明确的要求, 需要过德福考试. 就是听说读写得4个4以上就可以"
        ],
        "answer": {
            "好吧": "random_ask"
        }
    },
    "english_requirement": {
        question: [
            "还是那句话. 德国的博士招生一般不会有明确的语言分数要求." +
            "英语也一样. 博士的录取一般涉及到面试. 面试的时候教授会直接和你交流. " +
            "到时候你的语言能力的好坏很容易就能看出来了."
        ],
        "answer": {
            "好吧": "random_ask",
            "面试都会问些什么呢": "interview_problems"
        }
    },
    "interview_problems": {
        question: [
            "一般就是自我介绍, 研究经历, 让你讲讲你最得意的研究经历或是某篇论文. " +
            "会顺着你的论文问下去. 顺带着也会问一下这个领域内的基础知识."
        ],
        "answer": {
            "好吧": "random_ask"
        }
    }
};


function freeTextQA(x, y) {

}