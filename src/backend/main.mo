import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";

actor {
  type ClassLevel = Nat; // 6-12

  type Note = {
    classLevel : ClassLevel;
    subject : Text;
    topic : Text;
    content : Text;
  };

  var nextId = 1;
  let notes = Map.empty<Nat, Note>();

  // Seed data
  let seedData : [Note] = [
    // Mathematics
    {
      classLevel = 6;
      subject = "Mathematics";
      topic = "Fractions";
      content = "A fraction represents a part of a whole. It consists of a numerator and a denominator.";
    },
    {
      classLevel = 8;
      subject = "Mathematics";
      topic = "Linear Equations";
      content = "Linear equations are algebraic equations in which each term has an exponent of one.";
    },
    // Science
    {
      classLevel = 7;
      subject = "Science";
      topic = "Photosynthesis";
      content = "Photosynthesis is the process by which green plants make their own food using sunlight.";
    },
    {
      classLevel = 9;
      subject = "Science";
      topic = "Atoms and Molecules";
      content = "Atoms are the basic building blocks of matter. Molecules are combinations of atoms bonded together.";
    },
    // English
    {
      classLevel = 10;
      subject = "English";
      topic = "Grammar - Tenses";
      content = "Tenses indicate the time of action. English has three main tenses: past, present, and future.";
    },
    {
      classLevel = 11;
      subject = "English";
      topic = "Essay Writing";
      content = "Essays should have an introduction, body, and conclusion. Organize your thoughts clearly.";
    },
    // Social Studies
    {
      classLevel = 6;
      subject = "Social Studies";
      topic = "Ancient Civilizations";
      content = "Ancient civilizations include Mesopotamia, Egypt, Indus Valley, and China.";
    },
    {
      classLevel = 12;
      subject = "Social Studies";
      topic = "Indian Constitution";
      content = "The Constitution is the supreme law of India, adopted in 1949 and enacted in 1950.";
    },
    // Hindi
    {
      classLevel = 8;
      subject = "Hindi";
      topic = "संधि (Sandhi)";
      content = "संधि का अर्थ है - दो ध्वनियों का मिलन, जिससे नई ध्वनि उत्पन्न होती है।";
    },
    {
      classLevel = 10;
      subject = "Hindi";
      topic = "मुहावरे (Idioms)";
      content = "मुहावरे भाषा को रोचक और प्रभावशाली बनाते हैं। जैसे - आँख का तारा होना।";
    },
  ];

  for (note in seedData.values()) {
    notes.add(nextId, note);
    nextId += 1;
  };

  public shared ({ caller }) func addNote(classLevel : ClassLevel, subject : Text, topic : Text, content : Text) : async Nat {
    let note : Note = {
      classLevel;
      subject;
      topic;
      content;
    };
    let id = nextId;
    notes.add(id, note);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getNote(id : Nat) : async ?Note {
    notes.get(id);
  };

  public query ({ caller }) func getNotesByClass(classLevel : ClassLevel) : async [Note] {
    let filtered = notes.values().toArray().filter(
      func(note) {
        note.classLevel == classLevel;
      }
    );
    filtered;
  };

  public query ({ caller }) func getNotesBySubject(subject : Text) : async [Note] {
    let filtered = notes.values().toArray().filter(
      func(note) {
        note.subject.contains(#text subject);
      }
    );
    filtered;
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    notes.values().toArray();
  };
};
