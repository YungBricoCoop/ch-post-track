const displayPopup = (toast, severity, summary, detail) => {
    toast.current.show({severity:severity, summary: summary, detail:detail, life: 2000});
}

export { displayPopup };