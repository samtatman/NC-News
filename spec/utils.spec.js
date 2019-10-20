process.env.NODE_ENV = "test";
const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");
const { paginateResults } = require("../models/utils-models");

describe("formatDates", () => {
  let sample;
  let sampleTime1;
  beforeEach(() => {
    sample = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 999
      },
      {
        title: "yo im a bear",
        topic: "bearinf",
        author: "bessbelly",
        body:
          "This is part bear of a series on how to get up and running with Systemd and bear.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 576949
      },
      {
        title: "Running a Napp App",
        topic: "tyring",
        author: "the bear from before",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: 5753823
      }
    ];
    sampleTime1 = new Date(999);
    sampleTime2 = new Date(576949);
    sampleTime3 = new Date(5753823);
  });
  it("returns an empty array when passed an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("original array and objects inside are not mutated", () => {
    let arr = [sample[0]];
    const newArr = arr;
    formatDates(arr);
    expect(newArr[0]).to.equal(arr[0]);
  });
  it("returns a formatted array when passed a non-formatted array", () => {
    expect(formatDates([sample[0]])).to.eql([
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: sampleTime1
      }
    ]);
  });
  it("returns a formatted array of multiple objects when passed a non-formatted array of multiple objects", () => {
    expect(formatDates(sample)).to.eql([
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: sampleTime1
      },
      {
        title: "yo im a bear",
        topic: "bearinf",
        author: "bessbelly",
        body:
          "This is part bear of a series on how to get up and running with Systemd and bear.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: sampleTime2
      },
      {
        title: "Running a Napp App",
        topic: "tyring",
        author: "the bear from before",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        created_at: sampleTime3
      }
    ]);
  });
});

describe("makeRefObj", () => {
  let sample;
  beforeEach(() => {
    sample = [
      {
        article_id: 1,
        title: "Running a Node App",
        author: "jessjelly",
        body:
          "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
        topic: "coding",
        votes: 0
      },
      {
        article_id: 2,
        title:
          "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
        author: "jessjelly",
        body:
          "Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.",
        topic: "coding",
        votes: 0
      },
      {
        article_id: 3,
        title: "22 Amazing open source React projects",
        author: "happyamy2016",
        body:
          "This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.",
        topic: "coding",
        votes: 0
      }
    ];
  });
  it("returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("does not mutate original array or objects", () => {
    let arr = [sample[0]];
    const newArr = arr;
    makeRefObj(arr);
    expect(arr[0]).to.equal(newArr[0]);
  });
  it("when passed on object in array, returns object of value pair", () => {
    expect(makeRefObj([sample[0]], "title", "article_id")).to.eql({
      "Running a Node App": 1
    });
  });
  it("when passed multiple objects in  an array, returns object of many value pairs", () => {
    expect(makeRefObj(sample, "title", "article_id")).to.eql({
      "Running a Node App": 1,
      "The Rise Of Thinking Machines: How IBM's Watson Takes On The World": 2,
      "22 Amazing open source React projects": 3
    });
  });
});

describe("formatComments", () => {
  let sample;
  let sampleRef;
  let sampleTime1;
  let sampleTime2;
  let sampleTime3;
  beforeEach(() => {
    sample = [
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        belongs_to:
          "The People Tracking Every Touch, Pass And Tackle in the World Cup",
        created_by: "tickle122",
        votes: -1,
        created_at: 1468087638932
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        belongs_to: "Making sense of Redux",
        created_by: "grumpy19",
        votes: 7,
        created_at: 1478813209256
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        belongs_to: "22 Amazing open source React projects",
        created_by: "grumpy19",
        votes: 3,
        created_at: 1504183900263
      }
    ];
    sampleRef = {
      "The People Tracking Every Touch, Pass And Tackle in the World Cup": 1,
      "Making sense of Redux": 2,
      "22 Amazing open source React projects": 3
    };
    sampleTime1 = new Date(1468087638932);
    sampleTime2 = new Date(1478813209256);
    sampleTime3 = new Date(1504183900263);
  });
  it("returns an empty array when passed an empty array", () => {
    expect(formatComments([])).to.eql([]);
  });
  it("original array is not mutated", () => {
    let arr = [sample[0]];
    newArr = arr;
    formatDates(arr);
    expect(newArr[0]).to.equal(arr[0]);
  });
  it("returns an array with one formatted object when passed an array of one non-formatted object: replaces belongs_to with article_id, renames created_by to author and changes UNIX timestamp to JS Date Object", () => {
    expect(formatComments([sample[0]], sampleRef)).to.eql([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 1,
        author: "tickle122",
        votes: -1,
        created_at: sampleTime1
      }
    ]);
  });
  it("returns an array with one formatted object when passed an array of one non-formatted object", () => {
    expect(formatComments(sample, sampleRef)).to.eql([
      {
        body:
          "Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.",
        article_id: 1,
        author: "tickle122",
        votes: -1,
        created_at: sampleTime1
      },
      {
        body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
        article_id: 2,
        author: "grumpy19",
        votes: 7,
        created_at: sampleTime2
      },
      {
        body:
          "Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.",
        article_id: 3,
        author: "grumpy19",
        votes: 3,
        created_at: sampleTime3
      }
    ]);
  });
});

describe("paginateResults", () => {
  let testArray;
  beforeEach(() => {
    testArray = [...Array(30).fill("sample")];
  });
  it("returns an empty array when passed an empty array", () => {
    expect(paginateResults([], 10, 1)[0]).to.have.length(0);
    expect(paginateResults([], 10, 1)[1]).to.equal(0);
  });
  it("returns array of array of length 10 and total count when passed limit of 10 and p of 1", () => {
    expect(paginateResults(testArray, 10, 1)[0]).to.have.length(10);
    expect(paginateResults(testArray, 10, 1)[1]).to.equal(30);
  });
  it("limit defaults to 20 when passed invalid limit", () => {
    expect(paginateResults(testArray, "invalid", 1)[0]).to.have.length(20);
  });
  it("p defaults to 1 when passed invalid p", () => {
    expect(paginateResults(testArray, 10, "invalid")[0]).to.have.length(10);
  });
});
