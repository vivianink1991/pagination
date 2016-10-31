function extend(src, dst) {
    let keys = Object.keys(dst);
    for (let i = 0; i < keys.length; i++) {
        src[keys[i]] = dst[keys[i]];
    }
    return src;
}
function replace(str, replacement) {
    return str.replace(/{{.*}}/, '#' + replacement);
}
export {
    extend,
    replace
};