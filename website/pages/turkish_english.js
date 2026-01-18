let gridApiTE;
const gridOptionsTE = {
  rowData: [],
  getRowId: params => params.data.turkish,
  autoSizeStrategy: {type: "fitCellContents"},
  tooltipShowMode: "whenTruncated",
  tooltipShowDelay: 1000,
  enableCellTextSelection: true,
  defaultColDef: {filter: true},
  rowBuffer: 20,
  suppressColumnVirtualisation: false,
  pagination: true,
  rowClassRules: {
    "row-background-grey": "data.background_color == 'GREY'",
    "row-background-pink": "data.background_color == 'PINK'",
    "row-background-red": "data.background_color == 'RED'",
  },

  columnDefs: [
    {
      headerName: "#",
      valueGetter: params => params.node.rowIndex + 1,
      minWidth: 75,
      maxWidth: 75,
      sortable: false,
      filter: false,
    },
    {
      field: "turkish",
      minWidth: 150,
      maxWidth: 150,
      tooltipValueGetter: params => params.value,
    },
    {
      field: "turkish_translit",
      headerName: "Translit",
      minWidth: 150,
      maxWidth: 150,
      tooltipValueGetter: params => params.value,
    },
    {
      field: "english",
      minWidth: 400,
      maxWidth: 400,
      tooltipValueGetter: params => params.value,
    },
    {
      field: "part of speech", // TODO: "part_of_speech"
      headerName: "Part of speech",
      maxWidth: 150,
    },
    {
      field: "category",
      maxWidth: 150,
    },
    {
      field: "rank",
      maxWidth: 100,
      filter: "agNumberColumnFilter",
    },
    {
      field: "count",
      filter: "agNumberColumnFilter",
    },
    {
      field: "percent",
      filter: "agNumberColumnFilter",
    },
    {
      field: "google_translate",
      headerName: "Google",
      cellRenderer: GoogleTranslateLinkRendererTE,
      maxWidth: 90,
      filter: false,
    },
    {
      field: "wiktionary",
      cellRenderer: WiktionaryLinkRendererTE,
      maxWidth: 110,
      filter: false,
    },
  ],
};


let filterTimeoutTE;
function onFilterTextBoxChangedTE() {
  clearTimeout(filterTimeoutTE);
  filterTimeoutTE = setTimeout(() => {
    gridApiTE.setGridOption(
      "quickFilterText",
      document.getElementById("turkish-english-filter").value
    );
  }, 150);
}


function GoogleTranslateLinkRendererTE(params) {
  const a = document.createElement("a");
  a.textContent = "link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.href = `https://translate.google.com/details?sl=tr&tl=en&text=${encodeURIComponent(params.data.turkish_translit)}&op=translate`;
  return a;
}


function WiktionaryLinkRendererTE(params) {
  const a = document.createElement("a");
  a.textContent = "link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.href = `https://en.wiktionary.org/wiki/${encodeURIComponent(params.data.turkish)}#Turkish`;
  return a;
}


document.addEventListener('keydown', function(event) {
  if (event.key === '/') {
    var filter = document.getElementById('turkish-english-filter');
    filter.setSelectionRange(0, filter.value.length);
    filter.focus();
    event.preventDefault();
  }
});


gridApiTE = agGrid.createGrid(document.querySelector("#TurkishEnglishGrid"), gridOptionsTE);
fetch("data/turkish_english.json")
  .then((response) => response.json())
  .then((data) => gridApiTE.setGridOption("rowData", data));
