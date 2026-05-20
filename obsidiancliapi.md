根据 Obsidian CLI 官方文档，当前（v1.12+）相关的接口整理如下。

## 文件及文件夹 API
1. 文件信息查看
命令：obsidian file
描述：显示文件信息。默认为当前活动文件。支持 file=<名称>（使用 Wikilink 方式解析）或 path=<路径>（从仓库根目录指定完整路径）来指定目标文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径（从仓库根目录）

1. 列出文件列表
命令：obsidian files
描述：列出仓库中的文件。可按文件夹或扩展名过滤。
参数：
参数	类型	必填	说明
folder	string	否	按文件夹过滤
ext	string	否	按扩展名过滤
total	flag	否	返回文件总数

1. 文件夹信息
命令：obsidian folder
描述：显示文件夹信息，返回文件数、子文件夹数、大小等。
参数：
参数	类型	必填	说明
path	string	是	文件夹路径
info	string	否	返回指定信息，可选：files / folders / size

1. 列出文件夹列表
命令：obsidian folders
描述：列出仓库中的文件夹，可按父文件夹过滤。
参数：
参数	类型	必填	说明
folder	string	否	按父文件夹过滤
total	flag	否	返回文件夹总数

1. 打开文件
命令：obsidian open
描述：在 Obsidian 中打开文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径
newtab	flag	否	在新标签页中打开

1. 创建文件
命令：obsidian create
描述：创建或覆盖文件。支持指定内容和模板。
参数：
参数	类型	必填	说明
path	string	是	文件路径
content	string	是	初始内容（多行用 \n 换行）
template	string	否	使用的模板名称
overwrite	flag	否	若文件已存在，覆盖
open	flag	否	创建后打开
newtab	flag	否	在新标签页中打开

1. 读取文件内容
命令：obsidian read
描述：读取文件内容，默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径

1. 追加内容到文件
命令：obsidian append
描述：向文件末尾追加内容，默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径
content	string	是	要追加的内容
inline	flag	否	追加时不添加换行符

1. 在文件前插入内容
命令：obsidian prepend
描述：在文件前元数据（frontmatter）之后插入内容，默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径
content	string	是	要插入的内容
inline	flag	否	插入时不添加换行符

1.  移动/重命名文件
命令：obsidian move
描述：移动或重命名文件。根据设置自动更新内部链接。
参数：
参数	类型	必填	说明
path	string	是	文件路径
to	string	是	目标文件夹或路径

1.  重命名文件
命令：obsidian rename
描述：重命名文件（扩展名可省略），支持自动更新内部链接。如需同时重命名和移动，请使用 move 命令。
参数：
参数	类型	必填	说明
path	string	是	文件路径
name	string	是	新文件名

1.  删除文件
命令：obsidian delete
描述：删除文件，默认移至回收站。
参数：
参数	类型	必填	说明
path	string	是	文件路径
permanent	flag	否	跳过回收站，永久删除


## 链接 API
1. 反向链接
命令：obsidian backlinks
描述：列出指向目标文件的所有反向链接，默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	目标文件路径
counts	flag	否	包含链接计数
total	flag	否	返回反向链接总数
format	string	否	输出格式，可选：json / tsv / csv（默认 tsv）

1. 出站链接
命令：obsidian links
描述：列出指定文件的所有出站链接，默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径
total	flag	否	返回链接总数

1. 未解析链接
命令：obsidian unresolved
描述：列出仓库中所有未解析（指向不存在文件）的链接。
参数：
参数	类型	必填	说明
total	flag	否	返回未解析链接总数
counts	flag	否	包含链接计数
verbose	flag	否	包含源文件
format	string	否	输出格式，可选：json / tsv / csv（默认 tsv）

1. 孤立的笔记
命令：obsidian orphans
描述：列出仓库中没有被任何其他文件引用的孤立文件。
参数：
参数	类型	必填	说明
total	flag	否	返回孤立的笔记总数

1. 死胡同的笔记
命令：obsidian deadends
描述：列出仓库中没有包含任何出站链接的文件。
参数：
参数	类型	必填	说明
total	flag	否	返回死胡同的笔记总数

## 搜索 API
1. 全文搜索
命令：obsidian search
描述：在仓库中搜索文本，返回匹配的文件路径。
参数：
参数	类型	必填	说明
query	string	是	搜索关键词
path	string	否	限制在指定文件夹内搜索
limit	number	否	返回的最大文件数
format	string	否	输出格式，可选：text / json（默认 text）
total	flag	否	返回匹配总数
case	flag	否	区分大小写

2. 上下文搜索
命令：obsidian search:context
描述：搜索并返回匹配行的上下文，输出为 path:line: 样式。
参数：
参数	类型	必填	说明
query	string	是	搜索关键词
path	string	否	限制在指定文件夹内搜索
limit	number	否	返回的最大文件数
format	string	否	输出格式，可选：text / json（默认 text）
case	flag	否	区分大小写

## 大纲目录
1. 返回文档大纲目录
命令：obsidian outline
描述：返回指定文档的大纲目录
参数：
参数	类型	必填	说明
path	string	是	限制在指定文件夹内搜索
format	string	否	输出格式，可选：tree|md|json


## 大纲 API
1. 获取大纲
命令：obsidian outline
描述：显示当前笔记的大纲（标题结构），返回所有标题及其层级和文本。默认使用当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径（从仓库根目录）
depth	number	否	限制显示的最大标题层级（例如 1 只显示一级标题）

## 属性 API
1. 列出所有属性
命令：obsidian properties
描述：显示指定文件的所有 frontmatter 属性及其值。默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径
json	flag	否	以 JSON 格式输出

1. 获取单个属性值
命令：obsidian properties get <key>
描述：获取某个属性的值。
参数：
参数	类型	必填	说明
key	string	是	属性名
path	string	是	文件路径

1. 设置属性值
命令：obsidian properties set <key> <value>
描述：设置一个属性的值，如果属性不存在则创建。
参数：
参数	类型	必填	说明
key	string	是	属性名
value	string	是	属性值
path	string	是	文件路径

1. 删除属性
命令：obsidian properties delete <key>
描述：从文件中删除一个属性。
参数：
参数	类型	必填	说明
key	string	是	属性名
path	string	是	文件路径

## 标签 API
1. 列出所有标签
命令：obsidian tags
描述：列出仓库中所有标签及其出现次数，或列出指定文件的标签。默认显示整个仓库的标签。
参数：
参数	类型	必填	说明
path	string	否	文件路径
counts	flag	否	显示每个标签的出现次数（仓库模式下默认包含）
format	string	否	输出格式，可选：json / tsv / csv（默认 tsv）
注意：当指定 file 或 path 时，仅显示该文件内的标签；不指定则扫描整个仓库。

字数统计 API
1. 字数统计
命令：obsidian wordcount
描述：显示文件的字数、字符数等信息。默认为当前活动文件。
参数：
参数	类型	必填	说明
path	string	是	文件路径