const addLike = (btn) => {
    const projectId= btn.parentNode.parentNode.parentNode.querySelector("[name=projectId]").value
    fetch('/add-like/' + projectId, {
        method: 'POST'
    })
    .then(result => {
        return result.json() 
    })
    .then(data  => {
        console.log(data)
    })
    .catch(err => {
        console.log(err)
    })
}

const addRating = (input) => {
    const ratingValue = input.value
    const projectId = input.parentNode.parentnode.parentNode.querySelector("[name=projectId]").value
    fetch("/add-rating/" + peojectId, {
        method: "POST",
        body: JSON.stringify({
            ratingValue: ratingValue
        })
    })
    .then()
    .catch()
}