let gridApiET;
const gridOptionsET = {
  rowData: [],
  getRowId: params => params.data.english,
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
      field: "english",
      minWidth: 150,
      maxWidth: 150,
      tooltipValueGetter: params => params.value,
    },
    {
      field: "turkish",
      minWidth: 400,
      maxWidth: 400,
      tooltipValueGetter: params => params.value,
    },
    {
      field: "rank",
      maxWidth: 100,
      filter: "agNumberColumnFilter",
    },
    {
      field: "count (per billion)", // TODO: "count_per_billion"
      headerName: "Count (per billion)",
      maxWidth: 150,
      filter: "agNumberColumnFilter",
    },
    {
      field: "google translate",
      headerName: "Google",
      cellRenderer: GoogleTranslateLinkRendererET,
      maxWidth: 90,
      filter: false,
    },
    {
      field: "wiktionary",
      cellRenderer: WiktionaryLinkRendererET,
      maxWidth: 110,
      filter: false,
    }
  ],
};


let filterTimeoutET;
function onFilterTextBoxChangedET() {
  clearTimeout(filterTimeoutET);
  filterTimeoutET = setTimeout(() => {
    gridApiET.setGridOption(
      "quickFilterText",
      document.getElementById("english-turkish-filter").value
    );
  }, 150);
}


function GoogleTranslateLinkRendererET(params) {
  const a = document.createElement("a");
  a.textContent = "link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.href = `https://translate.google.com/details?sl=en&tl=tr&text=${encodeURIComponent(params.data.english)}&op=translate`;
  return a;
}


function WiktionaryLinkRendererET(params) {
  const a = document.createElement("a");
  a.textContent = "link";
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.href = `https://en.wiktionary.org/wiki/${encodeURIComponent(params.data.english)}#English`;
  return a;
}


document.addEventListener('keydown', function(event) {
  if (event.key === '/') {
    var filter = document.getElementById('english-turkish-filter');
    filter.setSelectionRange(0, filter.value.length);
    filter.focus();
    event.preventDefault();
  }
});


gridApiET = agGrid.createGrid(document.querySelector("#EnglishTurkishGrid"), gridOptionsET);
fetch("data/english_turkish.json")
  .then((response) => response.json())
  .then((data) => gridApiET.setGridOption("rowData", data));
