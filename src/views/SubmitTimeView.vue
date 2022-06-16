<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <form>
                    <div class="mb-3">
                        <select
                            class="form-select"
                            aria-label="Default select example"
                        >
                            <option selected>Player</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <!-- <label for="track" class="form-label">Track</label> -->

                        <select
                            class="form-select"
                            aria-label="Default select example"
                        >
                            <option selected>Track</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                    </div>
                    <div class="mb-5">
                        <div class="row">
                            <div class="col">
                                <label for="link" class="form-label"
                                    >Minutes</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="mins"
                                    placeholder="0"
                                />
                            </div>
                            <div class="col">
                                <label for="secs" class="form-label"
                                    >Seconds</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="secs"
                                    placeholder="0"
                                />
                            </div>
                            <div class="col">
                                <label for="ms" class="form-label"
                                    >Milliseconds</label
                                >
                                <input
                                    type="text"
                                    class="form-control"
                                    id="ms"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="link" class="form-label"
                            >Photo / Video Link</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="link"
                            placeholder="http://..."
                        />
                    </div>
                    <div class="mb-5">
                        <label for="notes" class="form-label">Notes</label>
                        <input
                            type="text"
                            class="form-control"
                            id="notes"
                            placeholder=""
                        />
                    </div>
                    <div class="d-grid gap-1">
                        <button class="btn btn-primary" type="button">
                            Submit Time
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 500px;
}
.header {
    margin-bottom: 20px;
}
</style>
