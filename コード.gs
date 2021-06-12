/** スプレッドシートの書き込みをスタートする行 */
var startLine = 1;

/** 書き込むシート名 */
var sheetName = 'シート1';

/** スプレッドシート */
var sheet;

function main() {
  /* 初期化 */
  // スプレッドシートのオブジェクトを取得
  sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

  // シートの初期化
  sheet.clear();

  /* ファイル、フォルダ一覧取得処理 */
  /** 対象フォルダのフォルダID */
  var folderId = "";

  getFileListInFolder(folderId, '');
  getFolderListInFolder(folderId, '');
}

/**
 * フォルダ内のファイル一覧をスプレッドシートに書き出す
 * @param {string} folderId   一覧を取得する対象フォルダのフォルダID
 * @param {string} rootPath   対象フォルダの相対パス
 */
function getFileListInFolder(folderId, rootPath) {
  var folder = DriveApp.getFolderById(folderId),
    files = folder.getFiles(),
    list = [],
    rowIndex = startLine, // The starting row of a range.
    colIndex = 1, // The starting row of a column.
    range;

  // ファイルがないときは処理を終了する
  if (files.hasNext() == false) {
    return;
  }

  // ファイル一覧をリストに格納
  while (files.hasNext()) {
    var buff = files.next();
    list.push([rootPath + buff.getName(), buff.getUrl()]);
  };

  // リストを古い順に並び変える
  list = list.reverse()

  // スプレッドシートの書き込む範囲を取得
  range = sheet.getRange(rowIndex, colIndex, list.length, list[0].length);
  // 書き込み
  range.setValues(list);

  // 書き込んだ分下にずらす
  startLine += list.length;
}

/**
 * フォルダ内のフォルダ一覧をスプレッドシートに書き出す
 * @param {string} folderId   一覧を取得する対象フォルダのフォルダID
 * @param {string} rootPath   対象フォルダの相対パス
 */
function getFolderListInFolder(folderId, rootPath) {
  var folders = DriveApp.getFolderById(folderId).getFolders(),
    list = [],
    colIndex = 1, // The starting row of a column.
    range;

  // 対象フォルダ内に子フォルダがないときは終了する
  if (folders.hasNext() == false) {
    return;
  }

  while (folders.hasNext()) {
    var buff = folders.next();
    list = [[rootPath + buff.getName(), buff.getUrl()]];  // フォルダ名、URL

    // フォルダ名をシートに書き込む
    range = sheet.getRange(startLine, colIndex, 1, list[0].length);
    range.setValues(list);
    // 一行書き込んだので下にずらす
    startLine++;

    // 子フォルダ内にあるファイル、フォルダの一覧を取得する
    currentId = buff.getId()  // 子フォルダのフォルダID
    currentPath = rootPath + buff.getName() + '/';  // 子フォルダの相対パス
    getFileListInFolder(currentId, currentPath);
    getFolderListInFolder(currentId, currentPath);
  };
}