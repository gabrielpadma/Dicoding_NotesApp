import React from "react";
import ReactDom from "react-dom/client";
import { getInitialData, showFormattedDate } from "./utils/index.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      NotesData: getInitialData(),
      ArchivedNotes: [],
      SearchData: [],
    };

    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleUnarchive = this.handleUnarchive.bind(this);
    this.handleDeleteArchivedNote = this.handleDeleteArchivedNote.bind(this);
    this.handleSearchNote = this.handleSearchNote.bind(this);
  }

  handleSaveNote(noteObj) {
    this.setState({ NotesData: [...this.state.NotesData, noteObj] });
  }

  handleDeleteNote(noteId) {
    this.setState({
      NotesData: this.state.NotesData.filter((note) => note.id != noteId),
    });
  }

  handleAddArchivedNotes(noteId) {
    const archivedIndex = this.state.NotesData.findIndex(
      (note) => note.id == noteId
    );

    const noteObj = {
      ...this.state.NotesData.find((note) => note.id == noteId),
      archived: true,
    };

    this.setState({
      ArchivedNotes: [...this.state.ArchivedNotes, noteObj],
      NotesData: this.state.NotesData.toSpliced(archivedIndex, 1),
    });
  }

  handleUnarchive(noteId) {
    this.setState({
      NotesData: [
        ...this.state.NotesData,
        this.state.ArchivedNotes.find((note) => note.id == noteId),
      ],
      ArchivedNotes: this.state.ArchivedNotes.filter(
        (note) => note.id != noteId
      ),
    });
  }

  handleDeleteArchivedNote(noteId) {
    this.setState({
      ArchivedNotes: this.state.ArchivedNotes.filter(
        (note) => note.id != noteId
      ),
    });
  }

  handleSearchNote(title) {
    console.log(title);

    if (title != "") {
      this.setState({
        SearchData: this.state.NotesData.filter(
          (note) => note.title.toLowerCase() == title.toLowerCase()
        ),
      });
    } else {
      return;
    }
  }

  render() {
    return (
      <>
        <Header handleSearchNote={this.handleSearchNote} />
        <Main>
          <FormNoteInput handleSaveNote={this.handleSaveNote} />
          <NotesList>
            {this.state.SearchData.length > 0 ? (
              this.state.SearchData.map((note) => (
                <Note
                  key={note.id}
                  title={note.title}
                  body={note.body}
                  createdAt={showFormattedDate(note.createdAt)}
                >
                  <Button
                    handleOnClick={() => this.handleDeleteNote(note.id)}
                    styleCss={"delete"}
                  >
                    Delete
                  </Button>
                  <Button
                    handleOnClick={() => this.handleAddArchivedNotes(note.id)}
                    styleCss={"archive"}
                  >
                    Arsipkan
                  </Button>
                </Note>
              ))
            ) : this.state.NotesData.length > 0 ? (
              this.state.NotesData.map((note) => (
                <Note
                  key={note.id}
                  title={note.title}
                  body={note.body}
                  createdAt={showFormattedDate(note.createdAt)}
                >
                  <Button
                    handleOnClick={() => this.handleDeleteNote(note.id)}
                    styleCss={"delete"}
                  >
                    Delete
                  </Button>
                  <Button
                    handleOnClick={() => this.handleAddArchivedNotes(note.id)}
                    styleCss={"archive"}
                  >
                    Arsipkan
                  </Button>
                </Note>
              ))
            ) : (
              <h2 className="notes-list__empty-message">Tidak ada catatan</h2>
            )}
          </NotesList>

          <NoteListArchive>
            {this.state.ArchivedNotes.length > 0 ? (
              this.state.ArchivedNotes.map((note) => (
                <ArchivedNote
                  key={note.id}
                  title={note.title}
                  body={note.body}
                  createdAt={showFormattedDate(note.createdAt)}
                >
                  <Button
                    handleOnClick={() => this.handleDeleteArchivedNote(note.id)}
                    styleCss={"delete"}
                  >
                    Delete
                  </Button>
                  <Button
                    handleOnClick={() => this.handleUnarchive(note.id)}
                    styleCss={"archive"}
                  >
                    Pindahkan
                  </Button>
                </ArchivedNote>
              ))
            ) : (
              <h2 className="notes-list__empty-message">Tidak ada arsip</h2>
            )}
          </NoteListArchive>
        </Main>
      </>
    );
  }
}

function Header({ handleSearchNote }) {
  return (
    <header className="note-app__header">
      <h1>Notes</h1>
      <form action="">
        <input
          type="text"
          name="searchNote"
          onChange={(e) => handleSearchNote(e.target.value)}
          placeholder="Cari catatan...."
        />
      </form>
    </header>
  );
}

function Main({ children }) {
  return <main className="note-app__body">{children}</main>;
}

class FormNoteInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputTitle: "",
      inputBody: "",
      inputTitleMaxLength: 50,
    };

    this.onchange = this.onchange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onchange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const note = {
      id: +new Date(),
      title: this.state.inputTitle,
      body: this.state.inputBody,
      createdAt: new Date(),
      archived: false,
    };
    this.props.handleSaveNote(note);
    this.setState({ inputTitle: "", inputBody: "" });
  }

  render() {
    return (
      <form action="" className="note-input" onSubmit={this.handleSubmit}>
        <h2 className="note-input__title">Buat Catatan</h2>
        <p className="note-input__title__char-limit ">
          Sisa karakter:
          {this.state.inputTitleMaxLength - this.state.inputTitle.length}
        </p>
        <input
          type="text"
          placeholder="Input Judul...."
          name="inputTitle"
          onChange={this.onchange}
          value={this.state.inputTitle}
          maxLength={this.state.inputTitleMaxLength}
        />
        <textarea
          id=""
          cols="30"
          rows="10"
          name="inputBody"
          placeholder="Tuliskan catatanmu di sini...."
          value={this.state.inputBody}
          onChange={this.onchange}
        ></textarea>
        <button type="submit">Buat</button>
      </form>
    );
  }
}

function NotesList({ children }) {
  return (
    <>
      <h2 className="">Catatan Aktif</h2>
      <section className="notes-list">{children}</section>
    </>
  );
}

function Note({
  title,
  body,
  createdAt,

  children,
}) {
  return (
    <article className="note-item">
      <div className="note-item__content">
        <h3 className="note-item__title">{title}</h3>
        <p className="note-item__date">{createdAt}</p>
        <p className="note-item__body">{body}</p>
      </div>
      <div className="note-item__action">{children}</div>
    </article>
  );
}

function NoteListArchive({ children }) {
  return (
    <>
      <h2 className="">Arsip</h2>
      <section className="notes-list">{children}</section>
    </>
  );
}

function ArchivedNote({ title, body, createdAt, children }) {
  return (
    <article className="note-item">
      <div className="note-item__content">
        <h3 className="note-item__title">{title}</h3>
        <p className="note-item__date">{createdAt}</p>
        <p className="note-item__body">{body}</p>
      </div>
      <div className="note-item__action">{children}</div>
    </article>
  );
}

function Button({ handleOnClick, children, styleCss }) {
  return (
    <button className={`note-item__${styleCss}-button`} onClick={handleOnClick}>
      {children}
    </button>
  );
}

export default App;
